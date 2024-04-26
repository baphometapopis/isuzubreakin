import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import {COLOR} from '../Constant/color';
import CustomAlert from '../Component/Modal/AlertModal';
import {FlatList} from 'react-native-gesture-handler';
import {Image} from 'react-native-animatable';
import {fetchProgressInspectionApi} from '../Api/fetchProgressInspection';
import {useNavigation} from '@react-navigation/native';
import {url} from '../Api/ApiEndpoint';
import CustomLoader from '../Component/Modal/Loader';
import {getData} from '../Utils/localStorageData';
import {fetchRejectedInspectionApi} from '../Api/fetchRejectedInspection';

export const RejectedInspectionScreen = () => {
  const [isErrorVisible, setisErrorVisible] = useState(false);
  const [pendingproposal, setpendingproposal] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [noRecordsFound, setNoRecordsFound] = useState(false);

  const navigation = useNavigation();
  const [ErrorMessage, setErrorMessage] = useState('');
  const toggleErrorAlert = () => {
    setisErrorVisible(!isErrorVisible);
  };
  const [loginData, setloginData] = useState();

  const getLocalData = async () => {
    const localdata = await getData('loggedInUser');
    if (localdata) {
      setloginData(localdata);
      fetchData(localdata);
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };

  const fetchData = async prop => {
    setisLoading(true);
    const data = {
      id: prop?.pos_login_data?.id,
      business_id: prop?.pos_login_data?.business_id,
    };
    const getres = await fetchRejectedInspectionApi(data);
    if (getres.status) {
      setpendingproposal(getres.data);
    } else {
      setisErrorVisible(true);
      setErrorMessage(getres?.message ?? 'Data Fetch Failed Try Again Later');
    }
    setisLoading(false);
  };

  useEffect(() => {
    getLocalData();
  }, []);

  // Filter the proposal items based on the search query
  const filteredProposal = pendingproposal.filter(
    item =>
      item?.vehicle_reg_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.proposal_no.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (filteredProposal.length === 0 && searchQuery !== '') {
      setNoRecordsFound(true);
    } else {
      setNoRecordsFound(false);
    }
  }, [filteredProposal, searchQuery]);

  return (
    <View style={styles.container}>
      <CustomLoader visible={isLoading} />
      <CustomAlert
        visible={isErrorVisible}
        message={ErrorMessage}
        onClose={toggleErrorAlert}
      />

      <TextInput
        style={styles.searchInput}
        placeholder="Search Vehicle No ,Proposal No"
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
        placeholderTextColor="#6d6d6d"
      />

      {noRecordsFound && (
        <Text style={styles.noRecordsText}>No Records Found</Text>
      )}

      <FlatList
        data={filteredProposal}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              navigation.navigate('ShowProposalInfo', {
                Item: item,
                path: 'rejected',
              })
            }
            style={styles.optionCard}>
            <View style={{flex: 0.35}}>
              <Image
                style={{alignSelf: 'center', height: 62, width: 102}}
                source={{
                  uri: `${url}assets/front/img/partners-logos/${item?.logo_name}`,
                }}
              />
            </View>
            <View style={{flex: 0.65}}>
              <Text style={styles.label}>Prop No : {item?.proposal_no}</Text>
              <Text style={styles.label}>Reg No : {item?.vehicle_reg_no}</Text>
              <Text style={styles.label}>IC Name : {item?.ic_name}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  label: {color: COLOR.TEXT_COLOR, fontWeight: '500', margin: 2},
  container: {backgroundColor: COLOR.BACKGROUND_COLOR, flex: 1},
  optionCard: {
    backgroundColor: 'white',
    alignItems: 'center',
    height: 110,
    flexDirection: 'row',
    borderRadius: 8,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  searchInput: {
    color: 'black',
    backgroundColor: 'white',
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 16,
    margin: 12,
  },
  noRecordsText: {
    alignSelf: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: 'red',
  },
});
