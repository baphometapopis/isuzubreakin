import {Api_Endpoints} from './ApiEndpoint';

export const fetchRejectedInspectionApi = async data => {
  console.log(data, 'fetch_breaking_rejected_data');
  var formdata = new FormData();
  formdata.append('pos_id', data?.id);
  formdata.append('is_data', '1');

  formdata.append('business_id', data?.business_id);

  const url = Api_Endpoints.fetchRejectedInspectionEndpoint;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formdata, // Use the FormData object directly
    });
    if (!response.ok) {
      console.log(`API Error - HTTP Status: ${response.status}`);

      const contentType = response.headers.get('Content-Type');
      console.error('Content-Type:', contentType);

      if (contentType && contentType.includes('application/json')) {
        const jsondata = await response.json();
        return jsondata;
      } else {
        const text = await response.text();
        console.log('Non-JSON Response:', text);
      }

      return response.status;
    }
    const datas = await response.json();
    console.log(datas);

    return datas;
  } catch (error) {
    throw new Error(`API Error - ${error}`);
  }
};
