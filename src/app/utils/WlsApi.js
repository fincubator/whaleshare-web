

export const rest2jsonrpc = async (path_params) => {
  // if (!process.env.BROWSER || window.$STM_Config.wls_api_url) return;
  // window.$STM_Config
  const url = `${$STM_Config.wls_api_url}/rest2jsonrpc${path_params}`;
  // console.log(url);
  const fetch_result = await fetch(url);
  const json_result = await fetch_result.json();

  return json_result.result;
};
