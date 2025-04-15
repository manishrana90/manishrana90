import axios from "axios";

const BACKEND_URL = "https://rnapi.paisaexch.com/api/";
const NEW_BACKEND_URL = "https://socket.paisaexch.com/user/";

const WALLET_URL = "https://acepunt.kushubmedia.com/user/";
const NEW_WALLET_URL = "https://adminapi.paisaexch.com/wallet/";
const NEW_WALLET_ADMIN_URL = "https://adminapi.paisaexch.com/admin/";


export async function BannerAPI() {
  const response = await axios.get(BACKEND_URL + "get-banner/");
  return response.data;
}

export async function CasinoAPI() {
  const response = await axios.get(BACKEND_URL + "HomeGames/");
  return response.data;
}


export async function FilterCasinoAPI(data) {
  const response = await axios.post(
    BACKEND_URL + 'get-casinoidx/',
    data,
  );
  return response.data;
}

export async function ProviderGamesAPI(data) {
  const response = await axios.post(BACKEND_URL + "providerGames/", data);
  return response.data;
}

export async function SingleCasinoAPI(data) {
  const response = await axios.get(BACKEND_URL + 'getCasinolinkapp/'+ data.username +'/' + data.gameId +'/' + data.tableId, data);
  return response.data;
}

export async function SingleGameAPI(data) {
  const response = await axios.post(BACKEND_URL + 'singleGame/', data);
  return response.data;
}

// Payment Method...
export async function PaymentMethod(data) {
  // const response = await axios.post(WALLET_URL + "getPaymentMethod/"+ token, data);
  const response = await axios.post(NEW_WALLET_URL + "user-deposit-method/", data);
  return response.data;
}

export async function DepositPaymentType(token) {
  const response = await axios.post(BACKEND_URL + "razorPayStatus/", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function WithdrawalMethod(data) {
  // const response = await axios.get(WALLET_URL + "getwithdrawnMethod/"+ token);
  const response = await axios.post(NEW_WALLET_URL + "user-withdraw-method/", data);
  return response.data;
}

export async function WithdrawalPayment(data) {
  // const response = await axios.post(WALLET_URL + "withdrawalPayment/"+ token, data, {
  const response = await axios.post(NEW_WALLET_URL + "create-withdraw-request/", data, {
  });
  return response.data;
}

export async function GetBankList(data) {
  const response = await axios.post(NEW_WALLET_URL + "get-bank-list/", data);
  return response.data;
}


export async function DepositPayment(data, token) {
  const response = await axios.post(WALLET_URL + "depositPayment/"+token, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
  return response.data;
}

export async function CreateDepositRequest(data) {
  const response = await axios.post(NEW_WALLET_URL + "create-deposit-request/", data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
  return response.data;
}

export async function AddWithdrawalMethod(data, token) {
  // const response = await axios.post(NEW_WALLET_URL + "withdrawalMethod/"+token, data, {
  const response = await axios.post(NEW_WALLET_URL + "create-user-withdraw-method/", data, {
  });
  return response.data;
}

export async function GetUserDetail(data, token) {
  const response = await axios.post(BACKEND_URL + "getUserDetails/", data);
  return response.data;
}

export async function WalletToken(data) {
  const response = await axios.get(
    WALLET_URL + 'getUserByToken/' + data,
  );
  return response.data;
}

export async function RemoveWithdrawalMethod(data) {
  // const response = await axios.put(WALLET_URL + "deleteWithdrawlMethod/" + token, data, {
  const response = await axios.post(NEW_WALLET_URL + "delete-withdraw-method/", data);
  return response.data;
}

export async function GetAllTransaction(data) {
  const response = await axios.post(NEW_WALLET_URL + "transactions/", data);
  return response.data;
}

export async function UpdateDeviceId(data) {
  // const response = await axios.post(NEW_WALLET_URL + "updateDeviceId/", data, {
  const response = await axios.post(NEW_WALLET_ADMIN_URL + "update-deviceIdx/", data, {
  });
  return response.data;
}


export async function GetSetting(data, token){
  const response = await axios.post(BACKEND_URL + "getSetting/", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
}

export async function UserSettingAPI(data){
  const response = await axios.post(NEW_BACKEND_URL + "menusetting/", data);
  return response.data
}



export async function GetBonusCode(data){
  const response = await axios.post(BACKEND_URL + "getBonusByCode/", data);
  return response.data
}

export async function DepositBalance(username, balance) {
  const response = await axios.get(
    BACKEND_URL + 'casino-balance-transferapp/' + username + '/' + balance,
  )

  return response.data;
} 

export async function WithdrawalBalance(username, balance) {
  const response = await axios.get(
    BACKEND_URL + 'casino-balance-withdrawapp/' + username + '/' + balance,
  )

  return response.data;
} 

export async function AddNewUser(data) {
  const response = await axios.post(NEW_WALLET_URL + 'register/',data );
  return response.data;
}

export async function VerifyUserOtp(data) {
  const response = await axios.post(NEW_WALLET_URL + 'verifyOtp/', data,);
  return response.data;
}


export async function ResendOtp(data) {
  const response = await axios.post(
    NEW_WALLET_URL + 'resendOtp/',
    data,
  );
  return response.data;
} 

export async function SendOtpWallet(data) {
  const response = await axios.post(NEW_WALLET_URL + "createOTP/", data);
  return response.data;
}

export async function GetManagerNo(data) {
  const response = await axios.post(NEW_BACKEND_URL + "get-support/", data);
  return response.data;
}

export async function GetCreateId( data, token ) {
  const response = await axios.post(WALLET_URL + "getSite/" + token, data);
  return response.data;
}

export async function GetmyId( token ) {
  const response = await axios.get( WALLET_URL + 'getMysites/' + token );
  return response.data;
}

export async function CreatesIdAPI(data, token) {
  const response = await axios.post( WALLET_URL + 'createMysites/' + token, data,
    {headers: {'Content-Type': 'multipart/form-data'}}
  );
  return response.data;
}

export async function WithdrawInsite(data, token) {
  const response = await axios.post( WALLET_URL + 'withdrawalInsites/' + token, data,
    {headers: { 'Content-Type': 'multipart/form-data' }},
  );
  return response.data;
}

export async function withdrawgetPreffered(data) {
  const response = await axios.get( WALLET_URL + 'getPrefferedWithdrawl/' + data);
  return response.data;
}

export async function DespositInsite(data, token) {
  const response = await axios.post( WALLET_URL + 'depositInsite/' + token, data,
    {headers: {'Content-Type': 'multipart/form-data'}},
  );
  return response.data;
}

export async function GetMySiteTransaction(data, token) {
  const response = await axios.post( WALLET_URL + 'getmysiteTransaction/' + token, data);
  return response.data;
}

export async function GetOffer(data) {
  let formdata = {filter: {manager: data}};
  const response = await axios.post(
    BACKEND_URL + 'get-offer/',
    formdata,
  );
  return response.data;
}

export async function GetUserSetting(data) {
  const response = await axios.post(NEW_BACKEND_URL + "system-setting/", data);
  return response.data;
}

export async function GetCasinoPermission() {
  const response = await axios.get(BACKEND_URL + 'casino-permision/');
  return response.data;
}

export async function cancelTransactionAPI(data) {
  const response = await axios.post(NEW_WALLET_URL + 'cancelWithdrawl/', data);
  return response.data;
}

export async function GetMarketsAPI(data) {
  const response = await axios.post(NEW_BACKEND_URL + 'get-market/', data);
  return response.data;
<<<<<<< HEAD
}
=======
}
export async function GetlcasinoAPI(data) {
  const response = await axios.post(NEW_BACKEND_URL + 'lobby-url/', data);
  return response.data;
}
>>>>>>> origin/main
