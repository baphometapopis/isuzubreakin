import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import {COLOR} from '../Constant/color';
import CustomAlert from '../Component/Modal/AlertModal';
import {fetchProposalDetails} from '../Api/fetchProposalDetails';
import {useNavigation} from '@react-navigation/native';
import {url} from '../Api/ApiEndpoint';
import {isInspectionImagesFolderEmpty} from '../Utils/checkLocalStoragefordata';
import {CallIcon, StartInspection} from '../Constant/ImageConstant';
import CustomerCareModal from '../Component/Modal/CustomerCareModal';
import CustomLoader from '../Component/Modal/Loader';

export const ShowProposalInfo = ({route}) => {
  const [isLoading, setLoading] = useState(false);

  const {Item, path} = route.params;
  const [isErrorVisible, setisErrorVisible] = useState(false);
  const navigate = useNavigation();
  const [proposalInfo, setproposalInfo] = useState();
  const [isInspectionImagesPresent, setisInspectionImagesPresent] = useState();
  const [isCustomerCareModalVisible, setIsCustomerCareModalVisible] =
    useState(false);
  const toggleCustomerCareModal = () => {
    setIsCustomerCareModalVisible(!isCustomerCareModalVisible);
  };

  const [ErrorMessage, setErrorMessage] = useState('');
  const toggleErrorAlert = () => {
    setisErrorVisible(!isErrorVisible);
  };

  const redirect = () => {
    if (isInspectionImagesPresent) {
      navigate.navigate('ShowInspectionImages', {
        capturedImagesWithOverlay: isInspectionImagesPresent,
        proposalInfo: proposalInfo,
      });
    } else {
      navigate.navigate('inspectionCheckpoint', proposalInfo);
    }
  };

  const fetchData = async () => {
    setLoading(true);

    const getData = await fetchProposalDetails(Item.proposal_id);
    if (getData.status) {
      console.log(getData.data[0]);
      setproposalInfo(getData?.data);

      if (path === 'new') {
        const isthere = await isInspectionImagesFolderEmpty(
          getData?.data?.proposal_no,
        );
        setisInspectionImagesPresent(isthere);
      }
      // console.log(isthere);
    } else {
      setisErrorVisible(true);
      setErrorMessage('Data Fetch Failed Try Again Later');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <CustomLoader visible={isLoading} param={'login'} />

      <ScrollView Vertical>
        <CustomerCareModal
          isVisible={isCustomerCareModalVisible}
          onClose={toggleCustomerCareModal}
        />

        <CustomAlert
          visible={isErrorVisible}
          message={ErrorMessage}
          onClose={toggleErrorAlert}
        />
        <View style={styles.optionCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flex: 0.35}}>
              <Image
                style={{alignSelf: 'center', height: 62, width: 102}}
                source={{
                  uri: `${url}assets/front/img/partners-logos/${proposalInfo?.logo_image}`,
                }}
              />
            </View>
            <View style={{flex: 0.65}}>
              <Text style={styles.label}>
                Prop No : {proposalInfo?.proposal_no}
              </Text>
              <Text style={styles.label}>
                Reg No : {proposalInfo?.vehicle_reg_no}
              </Text>
              <Text style={styles.label}>
                IC Name : {proposalInfo?.ic_name}
              </Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', marginTop: 15}}>
            <ScrollView horizontal>
              <View style={{marginLeft: 20, gap: 15}}>
                <Text style={styles.label}>Proposal No :</Text>
                <Text style={styles.label}>Inspection Type :</Text>
                <Text style={styles.label}>Registration No:</Text>
                <Text style={styles.label}>Registration Year:</Text>
                <Text style={styles.label}>Make :</Text>
                <Text style={styles.label}>Model :</Text>
                <Text style={styles.label}>Variant :</Text>
                <Text style={styles.label}>Engine no :</Text>
                <Text style={styles.label}>Chassis No :</Text>
                {path === 'progress' && (
                  <Text style={styles.label}>Status:</Text>
                )}
                {path === 'referBack' && (
                  <Text style={styles.label}>Admin Comment:</Text>
                )}
                {path === 'referBack' && (
                  <Text style={styles.label}>Status:</Text>
                )}

                {path === 'rejected' && (
                  <Text style={styles.label}>Status:</Text>
                )}
                {path === 'rejected' && (
                  <Text style={styles.label}>Admin Comment:</Text>
                )}
              </View>
              <View style={{marginLeft: 20, gap: 15}}>
                <Text style={styles.label}>{proposalInfo?.proposal_no}</Text>
                <Text style={styles.label}>
                  {proposalInfo?.inspection_type}
                </Text>
                <Text style={styles.label}>{proposalInfo?.vehicle_reg_no}</Text>
                <Text style={styles.label}>{proposalInfo?.manf_year}</Text>
                <Text style={styles.label}>{proposalInfo?.make}</Text>
                <Text style={styles.label}>{proposalInfo?.make_model}</Text>
                <Text style={styles.label}>{proposalInfo?.varient_name}</Text>
                <Text style={styles.label}>{proposalInfo?.engine_no}</Text>
                <Text style={styles.label}>{proposalInfo?.chassis_no}</Text>
                {path === 'progress' && (
                  <Text style={styles.label}>Under Review</Text>
                )}
                {path === 'rejected' && (
                  <Text style={styles.label}>Rejected</Text>
                )}
                {path === 'rejected' && (
                  <Text style={[styles.label, {width: 200}]}>
                    {proposalInfo?.admin_comment}
                  </Text>
                )}
                {path === 'referBack' && (
                  <Text style={[styles.label, {width: 200}]}>
                    {proposalInfo?.admin_comment}
                  </Text>
                )}
                {path === 'referBack' && (
                  <Text style={[styles.label, {width: 200}]}>
                    Your Breakin has been ReferBack by admin please restart
                    Inspection
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 25,
            }}>
            <TouchableOpacity
              onPress={toggleCustomerCareModal}
              style={styles.customercare}>
              <Image
                style={{alignSelf: 'center', height: 20, width: 20}}
                source={CallIcon}
              />
              <Text style={{color: 'white', fontWeight: '600', fontSize: 12}}>
                Call Customer Care
              </Text>
            </TouchableOpacity>
            {(path === 'new' || path === 'referBack') && (
              <TouchableOpacity
                onPress={redirect}
                style={styles.StartInspection}>
                <Image
                  style={{alignSelf: 'center', height: 20, width: 20}}
                  source={StartInspection}
                />
                <Text style={{color: 'white', fontWeight: '600', fontSize: 12}}>
                  Start Inspection
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  customercare: {
    backgroundColor: '#6EA4E3',
    flexDirection: 'row',
    padding: 15,
    gap: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  StartInspection: {
    backgroundColor: '#44CA82',
    flexDirection: 'row',
    padding: 15,
    gap: 15,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {color: COLOR.TEXT_COLOR, fontWeight: '500', margin: 2},
  container: {backgroundColor: COLOR.BACKGROUND_COLOR, flex: 1},
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 8,
    paddingVertical: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
});

export default ShowProposalInfo;
