import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import Constants, { Currency, FONTS } from '../../Assets/Helpers/constant';
import moment from 'moment';
import { BackIcon, CheckIcon, UncheckIcon } from '../../../Theme';
import { useDispatch, useSelector } from 'react-redux';
import { goBack } from '../../../utils/navigationRef';
import { useTranslation } from 'react-i18next';
import { getProgress, updateProgress } from '../../../redux/progress/progressAction';

const ProgressChecklist = props => {
  const data = props?.route?.params;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [progresslist, setprogresslist] = useState();
  const [progress_id, setprogress_id] = useState();
  useEffect(() => {
    {
      data && getProgresslist();
    }
  }, []);
  const getProgresslist = () => {
    dispatch(getProgress(data))
      .unwrap()
      .then(res => {
        // const arr = Object.values(res);
        console.log(res);
        setprogress_id(res?._id)
        setprogresslist(convertToArray(res));
      })
      .catch(error => {
        console.error('Checklist failed:', error);
      });
  };
  const updateProgresslist = () => {
    const obj=convertToObject(progresslist)
    console.log('obj',obj)
    obj.id=progress_id
    dispatch(updateProgress(obj))
      .unwrap()
      .then(res => {
        console.log(res);
        goBack()
      })
      .catch(error => {
        console.error('Checklist failed:', error);
      });
  };
  const convertToArray = studentData => {
    return (
      Object.entries(studentData)
        // .filter(([key]) => key.startsWith("module"))
        .filter(
          ([key, value]) =>
            typeof value === 'object' &&
            value !== null &&
            !['_id', 'createdAt', 'student', '__v', 'updatedAt'].includes(key),
        )
        .map(([key, value]) => ({
          title: key,
          data: Object.entries(value).map(([subKey, subValue]) => ({
            key: subKey,
            value: subValue,
          })),
        }))
    );
  };

  const convertToObject = moduleArray => {
    const result = {};
    moduleArray.forEach(module => {
      result[module.title] = {};
      module.data.forEach(item => {
        result[module.title][item.key] = item.value;
      });
    });
    return result;
  };
  const labelize = key => {
    key = key.replace(/[_-]/g, ' ');
    key = key.replace(/([a-z])([A-Z])/g, '$1 $2');
    return key
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Toggle all subitems in a module
const handleModulePress = moduleIndex => {
  const updated = [...progresslist];
  const allTrue = updated[moduleIndex].data.every(item => item.value === true);
  // If all are true → set all to false, else set all to true
  updated[moduleIndex].data = updated[moduleIndex].data.map(item => ({
    ...item,
    value: !allTrue,
  }));
  setprogresslist(updated);
};

// Toggle a single subitem
const handleSubItemPress = (moduleIndex, itemIndex) => {
  const updated = [...progresslist];
  updated[moduleIndex].data[itemIndex].value =
    !updated[moduleIndex].data[itemIndex].value;
  setprogresslist(updated);
};

  return (
    <View style={styles.container}>
      <View style={styles.frowbtn}>
        <TouchableOpacity style={styles.backcov} onPress={() => goBack()}>
          <BackIcon color={Constants.black} />
        </TouchableOpacity>
        <Text style={styles.headtxt1}>{t('Progress Checklist')}</Text>
        <View></View>
      </View>

      <FlatList
        data={progresslist}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: 20 }}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: Dimensions.get('window').height - 200,
            }}
          >
            <Text
              style={{
                color: Constants.black,
                fontSize: 18,
                fontFamily: FONTS.Medium,
              }}
            >
              {progresslist?.length===0?t('No List Found'):t('Loading...')}
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <TouchableOpacity style={styles.subItemcov} onPress={()=>handleModulePress(index)}>
              <View style={styles.itcov}>
                <Text style={styles.ittxt}>{index + 1}</Text>
              </View>
              <Text style={styles.moduleTitle}>{t(item.title)}</Text>
              <View style={styles.boxmaincov}>
                <View style={[styles.boxcov,{backgroundColor: item.data.every(sub => sub.value) ?'#1EB420':'#F49336'}]}>
                  <Text style={styles.boxwitxt}>d</Text>
                </View>
                <View style={[styles.boxcov,{backgroundColor:item.data.every(sub => sub.value) ?'#1EB420':'#F49336'}]}>
                  <Text style={styles.boxwitxt}>ö</Text>
                </View>
                <View style={[styles.boxcov,{backgroundColor:item.data.every(sub => sub.value) ?'#1EB420':'#F49336'}]}>
                  <Text style={styles.boxwitxt}>t</Text>
                </View>
{item.data.every(sub => sub.value) ? (
      <CheckIcon
        height={20}
        width={20}
        color={Constants.custom_green}
      />
    ) : (
      <UncheckIcon
        height={20}
        width={20}
        color={Constants.customgrey2}
      />
    )}
              </View>
            </TouchableOpacity>
            <View style={{ marginLeft: 15 }}>
              {item.data.map((subItem, itemIndex) => (
                <TouchableOpacity
                  key={subItem.key}
                  onPress={() => handleSubItemPress(index, itemIndex)}
                  style={[styles.subItemcov, { marginVertical: 10 }]}
                >
                  <Text style={styles.label}>• {t(subItem.key)}</Text>
                  <View style={styles.boxmaincov}>
                    <View style={[styles.boxcov,{backgroundColor: subItem.value ?'#1EB420':'#F49336'}]}>
                      <Text style={styles.boxwitxt}>D</Text>
                    </View>
                    <View style={[styles.boxcov,{backgroundColor: subItem.value ?'#1EB420':'#F49336'}]}>
                      <Text style={styles.boxwitxt}>Ö</Text>
                    </View>
                    <View style={[styles.boxcov,{backgroundColor: subItem.value ?'#1EB420':'#F49336'}]}>
                      <Text style={styles.boxwitxt}>T</Text>
                    </View>
                    {subItem.value ?<CheckIcon height={20}
                      width={20}
                      color={Constants.custom_green}/>:<UncheckIcon
                      height={20}
                      width={20}
                      color={Constants.customgrey2}
                    />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
      <TouchableOpacity
              style={styles.shdbtn}
              onPress={() => updateProgresslist()}
            >
              <Text style={styles.shdbtntxt}>{t("Submit")}</Text>
            </TouchableOpacity>
    </View>
  );
};

export default ProgressChecklist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.white,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backcov: {
    height: 30,
    width: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Constants.customgrey4,
  },
  frowbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 20,
  },
  headtxt1: {
    fontSize: 16,
    color: Constants.black,
    fontFamily: FONTS.Medium,
    marginLeft: -30,
  },
  moduleTitle: {
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: Constants.black,
    textTransform: 'capitalize',
    // marginLeft:10
  },
  label: {
    fontSize: 12,
    fontFamily: FONTS.Medium,
    color: Constants.black,
  },
  ittxt: {
    fontSize: 16,
    fontFamily: FONTS.SemiBold,
    color: Constants.black,
  },
  card: {
    marginTop: 10,
    backgroundColor: Constants.white,
    paddingVertical: 10,
  },
  itcov: {
    backgroundColor: '#F5F5FF',
    borderRadius: 20,
    height: 25,
    width: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxcov: {
    backgroundColor: '#F49336',
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    // backgroundColor:'#1EB420'
  },
  boxwitxt: {
    color: Constants.black,
    fontSize: 12,
    fontFamily: FONTS.SemiBold,
    // lineHeight:12
  },
  boxmaincov: {
    flexDirection: 'row',
    gap: 5,
    // marginLeft: 5,
  },
  subItemcov: {
    flexDirection: 'row',
    gap: 10,
  },
  shdbtn: {
    backgroundColor: Constants.custom_blue,
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // width: '90%',
    // alignSelf: 'center',
    marginBottom:10
  },
  shdbtntxt: {
    fontSize: 16,
    color: Constants.white,
    fontFamily: FONTS.SemiBold,
  },
});
