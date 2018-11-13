/*global $STM_Config */
import koa_router from 'koa-router';
import koa_body from 'koa-body';
import config from 'config';
import {emailRegex, getRemoteIp, rateLimitReq, checkCSRF} from 'server/utils/misc';
import coBody from 'co-body';
import Mixpanel from 'mixpanel';
import {PublicKey, Signature, hash} from '@whaleshares/wlsjs/lib/auth/ecc';
import {api, broadcast} from '@whaleshares/wlsjs';
// import * as WlsApi from '../../app/utils/WlsApi';
import RIPEMD160 from 'ripemd160';
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: config.get('s3.access_key'),
  secretAccessKey: config.get('s3.secret_key'),
  region: config.get('s3.region'),
  endpoint: config.get('s3.endpoint'),
  signatureVersion: config.get('s3.signatureVersion')
});

const mixpanel = config.get('mixpanel') ? Mixpanel.init(config.get('mixpanel')) : null;

const _stringval = (v) => typeof v === 'string' ? v : JSON.stringify(v)

function logRequest(path, ctx, extra) {
  let d = {ip: getRemoteIp(ctx.req)}
  if (ctx.session) {
    if (ctx.session.user) {
      d.user = ctx.session.user
    }
    if (ctx.session.uid) {
      d.uid = ctx.session.uid
    }
    if (ctx.session.a) {
      d.account = ctx.session.a
    }
  }
  if (extra) {
    Object.keys(extra).forEach((k) => {
      const nk = d[k] ? '_' + k : k
      d[nk] = extra[k]
    })
  }
  const info = Object.keys(d).map((k) => `${ k }=${ _stringval(d[k]) }`).join(' ')
  console.log(`-- /${ path } --> ${ info }`)
}

export default function useGeneralApi(app) {
  const router = koa_router({prefix: '/api/v1'});
  app.use(router.routes());
  const koaBody = koa_body({
    "formLimit": "5mb",
    "jsonLimit": "5mb",
    "textLimit": "5mb"
  });


  router.post('/login_account', koaBody, function* () {
    // if (rateLimitReq(this, this.req)) return;
    const params = this.request.body;
    const {csrf, account, signatures} = typeof(params) === 'string' ? JSON.parse(params) : params;
    if (!checkCSRF(this, csrf)) return;
    logRequest('login_account', this, {account});
    try {
      if (signatures) {
        if (!this.session.login_challenge) {
          console.error('/login_account missing this.session.login_challenge');
        } else {
          const [chainAccount] = yield api.getAccountsAsync([account])
          // let [chainAccount] = yield WlsApi.rest2jsonrpc(`/database_api/get_accounts/[["${account}"]]`);
          if (!chainAccount) {
            console.error('/login_account missing blockchain account', account);
          } else {
            const auth = {posting: false}
            const bufSha = hash.sha256(JSON.stringify({token: this.session.login_challenge}, null, 0))
            const verify = (type, sigHex, pubkey, weight, weight_threshold) => {
              if (!sigHex) return
              if (weight !== 1 || weight_threshold !== 1) {
                console.error(`/login_account login_challenge unsupported ${type} auth configuration: ${account}`);
              } else {
                const sig = parseSig(sigHex)
                const public_key = PublicKey.fromString(pubkey)
                const verified = sig.verifyHash(bufSha, public_key)
                if (!verified) {
                  console.error('/login_account verification failed', this.session.uid, account, pubkey)
                }
                auth[type] = verified
              }
            }
            const {posting: {key_auths: [[posting_pubkey, weight]], weight_threshold}} = chainAccount
            verify('posting', signatures.posting, posting_pubkey, weight, weight_threshold)
            if (auth.posting) this.session.a = account;
          }
        }
      }

      this.body = JSON.stringify({status: 'ok'});
      const remote_ip = getRemoteIp(this.req);
      if (mixpanel) {
        mixpanel.people.set(this.session.uid, {ip: remote_ip, $ip: remote_ip});
        mixpanel.people.increment(this.session.uid, 'Logins', 1);
      }
    } catch (error) {
      console.error('Error in /login_account api call', this.session.uid, error.message);
      this.body = JSON.stringify({error: error.message});
      this.status = 500;
    }
    // recordWebEvent(this, 'api/login_account', account);
  });

  router.post('/logout_account', koaBody, function* () {
    // if (rateLimitReq(this, this.req)) return; - logout maybe immediately followed with login_attempt event
    const params = this.request.body;
    const {csrf} = typeof(params) === 'string' ? JSON.parse(params) : params;
    if (!checkCSRF(this, csrf)) return;
    logRequest('logout_account', this);
    try {
      this.session.a = null;
      this.body = JSON.stringify({status: 'ok'});
    } catch (error) {
      console.error('Error in /logout_account api call', this.session.uid, error);
      this.body = JSON.stringify({error: error.message});
      this.status = 500;
    }
  });

  router.post('/setUserPreferences', koaBody, function* () {
    const params = this.request.body;
    const {csrf, payload} = typeof(params) === 'string' ? JSON.parse(params) : params;
    if (!checkCSRF(this, csrf)) return;
    console.log('-- /setUserPreferences -->', this.session.user, this.session.uid, payload);
    if (!this.session.a) {
      this.body = 'missing logged in account';
      this.status = 500;
      return;
    }
    try {
      const json = JSON.stringify(payload);
      if (json.length > 1024) throw new Error('the data is too long');
      this.session.user_prefs = json;
      this.body = JSON.stringify({status: 'ok'});
    } catch (error) {
      console.error('Error in /setUserPreferences api call', this.session.uid, error);
      this.body = JSON.stringify({error: error.message});
      this.status = 500;
    }
  });

  router.post('/imageupload', koaBody, function* (){
    try {
      const username = this.session.a;
      if ((username === undefined) || (username === null)) {
        throw new Error("invalid user");
      }

      const jsonBody = this.request.body;
      // console.log(`jsonBody.data.length=${jsonBody.data.length}`);
      if (jsonBody.data.length > 5242880) { // 5MB
        throw new Error("File size too big!");
      }

      // data:image/jpeg;base64,
      let indexData = 0;
      if (jsonBody.data[23] === ',') {
        indexData = 23;
      } else if (jsonBody.data[22] === ',') {
        indexData = 22;
      } else if (jsonBody.data[21] === ',') {
        indexData = 21;
      } else {
        throw new Error("could not find index of [,]")
      }

      let prefix_data = jsonBody.data.substring(0, indexData);
      let base64_data = jsonBody.data.substring(indexData);

      // extract content type
      let file_ext = null;
      if (prefix_data.startsWith('data:image/jpeg;')) file_ext = 'jpeg';
      else if (prefix_data.startsWith('data:image/jpg;')) file_ext = 'jpg';
      else if (prefix_data.startsWith('data:image/png;')) file_ext = 'png';
      else if (prefix_data.startsWith('data:image/gif;')) file_ext = 'gif';
      else throw new Error("invalid content type");

      const content_type = `image/${file_ext}`;

      let buffer = new Buffer(base64_data, 'base64');
      // console.log(`buffer.length=${buffer.length}`);
      if (buffer.length > 4194304) { // 4MB
        throw new Error("File size too big!");
      }

      const hash_buffer = (new RIPEMD160().update(buffer).digest('hex'));
      const s3_file_path = `${username}/${hash_buffer}.${file_ext}`;

      yield s3.putObject({
        ACL: 'public-read',
        Bucket: config.get('s3.bucket'),
        Key: s3_file_path,
        Body: buffer,
        ContentType: content_type
      }).promise();

      const img_full_path = `https://img.whaleshares.io/${config.get('s3.bucket')}/${s3_file_path}`;
      this.body = JSON.stringify({status: 'ok', message: 'success', data: img_full_path});
    } catch (error) {
      console.error('Error in /imageupload api call', this.session.uid, error);
      this.body = JSON.stringify({error: error.message});
      this.status = 500;
    }
  });
}

const parseSig = hexSig => {
  try {
    return Signature.fromHex(hexSig)
  } catch (e) {
    return null
  }
}
