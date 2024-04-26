import {Api_Endpoints} from './ApiEndpoint';

export const submit_inspection_checkpointData = async data => {
  console.log(data, 'dsdsd');
  var formdata = new FormData();

  formdata.append('pos_id', data?.pos_id);
  formdata.append('break_in_case_id', data?.break_in_case_id);
  formdata.append('question_id', data?.question_id);
  formdata.append('proposal_list_id', data?.proposal_list_id);
  formdata.append('ic_id', data?.ic_id);
  formdata.append('answer_id', data?.answer_id);
  formdata.append('inspection_type', data?.inspection_type);
  const url = Api_Endpoints.submit_inspection_checkpoint;

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

export const submit_inspection_Images = async (data, param) => {
  console.log(data, param);
  var formdata = new FormData();

  formdata.append('pos_id', data?.pos_id);
  formdata.append('break_in_case_id', data?.break_in_case_id);
  formdata.append('question_id', data?.question_id);
  formdata.append('proposal_list_id', data?.proposal_list_id);
  formdata.append('ic_id', data?.ic_id);
  formdata.append('image', data?.answer_id);
  // formdata.append('inspection_type', data?.inspection_type);
  const url = Api_Endpoints.submit_inspection_images_new;

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

export const submit_inspection_Video = async (videouri, data) => {
  console.log(videouri);
  var formdata = new FormData();

  formdata.append('pos_id', data?.pos_id);
  formdata.append('break_in_case_id', data?.break_in_case_id);
  formdata.append('inspection_type', data?.inspection_type);
  formdata.append('proposal_id', data?.id);
  formdata.append('policy_endorsement_id', data?.policy_endorsement_id);
  formdata.append('file', videouri);

  // formdata.append('inspection_type', data?.inspection_type);
  const url = Api_Endpoints.submit_inspection_Video_Endpoint;
  // console.log(formdata);

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
