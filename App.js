import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Image, View, Touchable, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Button, Provider as PaperProvider, Text, TextInput, IconButton } from 'react-native-paper';
const transactionAmount = 555;

export default function App() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [test, setTest] = React.useState("");
  const [view, setView] = React.useState("login");  // which page expo loads first

  // API CALLS --------
  const getWeeklyLimit = () => {
    fetch('https://ht6-heimwallet.herokuapp.com/get_weekly_limit?patient=fjones')
      .then(response => response.json())
      .then(json => {
        console.log(json);
        setWeeklyLimit(json.weekly_limit);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getRemainingWeeklyLimit = () => {
    fetch('https://ht6-heimwallet.herokuapp.com/get_remaining_weekly_limit?patient=fjones')
      .then(response => response.json())
      .then(json => {
        console.log(json);
        setRemainingWeeklyLimit(json.remaining_spend_limit);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getManagedBalance = () => {
    fetch('https://metrohacks.com/get_managed_balance?patient=ssu')
      .then(response => response.json())
      .then(json => {
        console.log(json);
        setManagedBalance(json.managed_balance);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const makePurchase = () => {
    fetch(`https://metrohacks.com/make_purchase?patient=ssu&price=${transactionAmount}`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkForAuth = () => {
    fetch('https://ht6-metrohacks.com/check_for_auth?patient=ssu')
      .then(response => response.json())
      .then(json => {
        if (json.status === "approved") {
          setPaymentApproved(true);
        } else {
          setPaymentApproved(false);
        }
        console.log(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function loginAttempt() {
    if (username === "sally_su" && password === "1234") {
      setTest("logged in as patient");
      setView("patient");
    } else if (username === "benson_lash") {
      setView("manager");
    }
    else {
      setTest("incorrect username/password");
    }
  }

  if (view === "patient") {
    getWeeklyLimit();
    getRemainingWeeklyLimit();
  } else if (view === "hold") {
    makePurchase();
  } else if (view === "await") {
    checkForAuth();
  } else if (view === "success") {
    checkForAuth();
  }

  else if (view === "manager") {
    getWeeklyLimit();
    getRemainingWeeklyLimit();
    getManagedBalance();
  }

  return (
    <PaperProvider>
      { view=="login" &&
      <View style={styles.mainView}> 
      <View style={styles.TopView}>
          <Image source={require('./assets/mainlogo.png')} style={styles.logo} />
      </View>
        <View style={styles.BottomView}>
          <Image source={require('./assets/heading.png')} style={styles.Heading} />  
          <View style={styles.FormView}>
            <TextInput selectionColor={'black'} placeholder={"Username"} placeholderTextColor={'#000'} style={styles.TextInput} value={username} onChangeText={username => setUsername(username)}/>
            <TextInput selectionColor={'black'} placeholder={"Password"} secureTextEntry={true} placeholderTextColor={'#000'} style={styles.TextInput} value={password} onChangeText={password => setPassword(password)}/>
            <Button style={styles.Button} mode='contained' onPress={() => loginAttempt()}>
              Sign in
            </Button>
            <StatusBar style="auto" />
          </View>
        </View>
      </View>
  }

  { view == "patient" &&
    <View style={styles.mainView}> 
    <View style={styles.TopView2}>
        <Image source={require('./assets/mainlogo.png')} style={styles.logoCorner} />
        <Image source={require('./assets/header2.png')} style={styles.Header2} />

        <Image source={require('./assets/Credit.png')} style={styles.Credit} />

      <View style={styles.Allowance}>
        <Text variant="titleMedium" style={{ alignSelf: 'center', alignItems: 'center', color:'#3c7148', fontSize:17, fontWeight: '400' }}>
        weekly allowance: $400
        </Text>
      </View>
        <View style={styles.Update}>
        <Text variant="titleMedium" style={{ alignSelf: 'center', alignItems: 'center', color:'#97491b', fontSize:17, fontWeight: '400' }}>
          updates next on: November 23, 2022
        </Text>
      </View>

        <View style={styles.payBox}>
        <Text variant="titleMedium" style={{ alignSelf: 'center', alignItems: 'center', color:'black', fontSize:20, fontWeight: '450', marginTop: "-2%" }}>
          Pay Online
        </Text>
        <Button mode='contained' style={{ borderRadis: '10', width: '55%', height: '70%', backgroundColor: '#c5d7c9', marginTop: "5%"}}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}> Pay Now </Text>
          </Button>
          <IconButton color="#023020" icon="arrow-right" size={45} style={{marginTop:"-17%"}} onPress={() => {setView("hold")}}/>
        <Text />
      </View>
      
        <View style={styles.sosBox}>
        <Text variant="titleMedium" style={{ alignSelf: 'center', alignItems: 'center', color:'black', fontSize:20, fontWeight: 'bold' }}>
        🚨In an emergency right now?🚨
        </Text>
        <Button mode='contained' style={{ borderRadis: '10', width: '100%', backgroundColor: '#ff8c00', marginTop: "5%"}}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}> Hold for SOS </Text></Button>
        <Text />
        <Button mode='elevated' style={{ width: '100%', marginTop: '-2%', backgroundColor: "#f5f5f5" }}> <Text style={{fontWeight: 'bold', color:'#ff8c00' }}> Send location to contacts</Text></Button>
      </View>
    </View>
      <View style={styles.Footer}>
      </View>
    </View>
  }

{ view == "manager" &&
    <View style={styles.mainView}> 
    <View style={styles.TopView2}>

        <Image source={require('./assets/mainlogo.png')} style={styles.logoCorner} />
        <Image source={require('./assets/guardian-title.png')} style={styles.Header2} />

        <Image source={require('./assets/report.png')} style={styles.reportTitle} />

        <View style={styles.Report}>
        <Text variant="titleMedium" style={{ alignSelf: 'center', alignItems: 'center', color:'black', fontSize:25, fontWeight: '500', marginTop: "-2%" }}>
          Account Balance: $1,098.99 
        </Text>
        <Text variant="titleMedium" style={{ alignSelf: 'center', alignItems: 'center', color:'black', fontSize:20, fontWeight: '450', marginTop: "5%" }}>
          Total Spendings: $444.11 {"\n"}
          Weekly Balance left to spend: ${remainingWeeklyLimit} 
        </Text>
        <Button mode='contained' style={{ borderRadis: '10', width: '55%', height: '30%', backgroundColor: '#c5d7c9', marginTop: "5%"}}>
          <Text variant="titleMedium" style={{ fontWeight: 'bold', color: 'white' }}> Edit Account </Text>
          </Button>
        <Text />
      </View>

      <Image source={require('./assets/transaction-title.png')} style={styles.transactionTitle} />

      <View style={styles.Transactions}>
        <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: 'flex-start'}}>
              <View style={{width: "50%"}}>
                <Text style={{ color: '#3c7148', fontWeight:'bold'}}>TD Bank Transfer</Text>
              </View>
              <View style={styles.splitAmountItem}>
                <Text style={{ color: '#3c7148', textAlign: 'right', paddingLeft: 100, fontWeight: 'bold' }}>+210.00</Text>
                <Text style={{ color: '#000', textAlign: 'right' }}>19 Nov 2022</Text>
              </View>
            </View>
          </View>

          <View style={styles.Transactions}>
            <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: 'flex-start'}}>
              <View style={{width: "50%"}}>
                <Text style={{ color: '#3c7148',fontWeight:'bold' }}>Target</Text>
              </View>
              <View style={styles.splitAmountItem}>
                <Text style={{ color: '#F06363', textAlign: 'right', paddingLeft: 100, fontWeight: 'bold' }}>-62.30</Text>
                <Text style={{ color: '#000', textAlign: 'right' }}>19 Nov 2022</Text>
              </View>
            </View>
          </View>

          <View style={styles.Transactions}>
            <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: 'flex-start'}}>
              <View style={{width: "50%"}}>
                <Text style={{ color: '#3c7148', fontWeight:'bold' }}>Jay's Convenience</Text>
              </View>
              <View style={styles.splitAmountItem}>
                <Text style={{ color: '#F06363', textAlign: 'right', paddingLeft: 100, fontWeight: 'bold' }}>-$8.98</Text>
                <Text style={{ color: '#000', textAlign: 'right' }}>19 Nov 2022</Text>
              </View>
            </View>
          </View>

    </View>
      <View style={styles.Footer}>
      </View>
    </View>
}

    {view == "hold" &&
        <TouchableWithoutFeedback onPress={() => { setView("await") }}>
          <View style={styles.Container}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: "black", fontSize: "17" }} >Ready to pay? {"\n"} Hold your phone over payment terminal.</Text>
          </View>
        </TouchableWithoutFeedback>
      }

      {view == "await" &&
        <TouchableWithoutFeedback onPress={() => { setView("success") }}>
          <View style={styles.WaitContainer}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: "black", fontSize: "17" }} >Awaiting Confirmation from Guardian...</Text>
            <ActivityIndicator size="large" color='#000' style={{ margin: 25 }} />
          </View>
        </TouchableWithoutFeedback>
      }

      {view == "success" &&
        <TouchableWithoutFeedback onPress={() => { setView("unsuccessfull") }}>
          <View style={styles.SuccessContainer}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: "black", fontSize: "18" }} >Payment Successful!</Text>
            <IconButton color="#000" icon="check" size={45} style={{marginTop:"10%"}}/>
          </View>
        </TouchableWithoutFeedback>
      }

    {view == "unsuccessfull" &&
        <TouchableWithoutFeedback onPress={() => { setView("hold") }}>
          <View style={styles.noSuccessContainer}>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: "black", fontSize: "16" }} >Payment Unsuccessful !!! {"\n"}...{"\n"}{"\n"} Your guardian has declined this payment. {"\n"} It is more than your current credit!</Text>
            <IconButton color="#000" icon="alert" size={45} style={{marginTop:"10%"}}/>
          </View>
        </TouchableWithoutFeedback>
      }


    </PaperProvider>
  );
}

const styles = StyleSheet.create({
    mainView:{
      marginTop:40,
      flex:1,
      flexDirection:'column',
      justifyContent: 'center',
      alignItems: "center",
      backgroundColor:'#ffeed1',
    },
    TopView:{
      width:'100%',
      height:'40%',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#ffeed1',
    },
    BottomView:{
      width: '100%',
      height: '87%',
      backgroundColor:'#FFBA5D',
      borderTopLeftRadius:30,
      borderTopRightRadius:30
    },
    logo:{
      width:'55%',
      resizeMode:'contain',
      marginTop:20,
    },
    Heading:{
      resizeMode:'contain',
      width:'50%',
      marginTop:10,
      marginLeft:40,
    }, 
    FormView:{
      width: '100%',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      marginTop:-20
    },
    TextInput:{
      width:'90%',
      borderWidth:4,
      height:52,
      borderRadius:10,
      paddingLeft:5,
      backgroundColor: "#9997",
      marginTop:20,
    },
    Button: {
      width:'50%',
      height:52,
      backgroundColor:'#9997',
      borderRadius:10,
      marginTop:180,
      display:'flex',
      justifyContent:"center",
      alignItems:"center"
    }, 

    //

    logoCorner:{
      width: '20%',
      resizeMode:'contain',
      marginRight:310,
    },
    TopView2:{
      width:'100%',
      height:'100%',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#ffeed1',
    },
    Footer:{
      width: '100%',
      height: '15%',
      backgroundColor:'#FFBA5D',
      borderTopLeftRadius:10,
      borderTopRightRadius:10
    }, 
    Header2:{
      width: '80%',
      resizeMode:'contain',
      marginBottom:-10,
      marginTop:-92,
      marginRight:3
    }, 
    sosBox: {
      display: 'flex',
      width: '95%',
      height: '18%',
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 20,
      alignSelf: 'center',
      alignItems: 'center',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      marginBottom: 10,
    }, 
    payBox: {
      display: 'flex',
      width: '92%',
      height: '18%',
      backgroundColor: 'white',
      borderRadius: 5,
      marginBottom: 70,
      padding: 25,
      alignSelf: 'center',
      alignItems: 'center',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }, 
    Credit: {
      width: '90%',
      resizeMode:'contain',
      marginRight:10,
      marginTop: -45
    },
    Allowance: {
      display: 'flex',
      width: '92%',
      height: '5%',
      backgroundColor: 'white',
      borderRadius: 5,
      marginTop: -30,
      marginBottom: 100,
      padding: 10,
      alignSelf: 'center',
      alignItems: 'center',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    }, 
    Update: {
      display: 'flex',
      width: '92%',
      height: '5%',
      backgroundColor: 'white',
      borderRadius: 5,
      marginTop: -90,
      marginBottom: 40,
      padding: 10,
      alignSelf: 'center',
      alignItems: 'center',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },

    //

    reportTitle: {
      width: '70%',
      resizeMode:'contain',
      marginRight:10,
      marginTop: -60
    },
    transactionTitle: {
      width: '70%',
      resizeMode:'contain',
      marginRight:10,
      marginBottom: -40,
      marginTop: -50
    },
    Transactions: {
      display: 'flex',
      width: '92%',
      height: 'auto',
      backgroundColor: 'white',
      borderRadius: 5,
      marginTop: 15,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 5
    },
    Report: {
      display: 'flex',
      width: '92%',
      height: '22%',
      backgroundColor: 'white',
      borderRadius: 5,
      marginBottom: 70,
      padding: 25,
      alignSelf: 'center',
      alignItems: 'center',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },

    //
    Container: {
      display: 'flex',
      marginTop: 'auto',
      marginBottom: 'auto',
      paddingLeft: '10%',
      paddingTop: '103%',
      paddingBottom: '103%',
      paddingRight: '10%',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: "#c5d7c9"
    },
    WaitContainer: {
      display: 'flex',
      marginTop: 'auto',
      marginBottom: 'auto',
      paddingLeft: '10%',
      paddingTop: '100%',
      paddingBottom: '100%',
      paddingRight: '10%',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: "#9ccbb8"
    },
    SuccessContainer: {
      display: 'flex',
      marginTop: 'auto',
      marginBottom: 'auto',
      paddingLeft: '10%',
      paddingTop: '110%',
      paddingBottom: '100%',
      paddingRight: '10%',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: "#5f967c"
    },
    noSuccessContainer: {
      display: 'flex',
      marginTop: 'auto',
      marginBottom: 'auto',
      paddingLeft: '10%',
      paddingTop: '110%',
      paddingBottom: '100%',
      paddingRight: '10%',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: "#b2554d"
    }

});