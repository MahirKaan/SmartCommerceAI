import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCt2rFTpoV-MTFCAKyjlrqWRhrVn6zsr-s",
  authDomain: "smartcommerceai-b9869.firebaseapp.com",
  projectId: "smartcommerceai-b9869",
  storageBucket: "smartcommerceai-b9869.firebasestorage.app",
  messagingSenderId: "160981895409",
  appId: "1:160981895409:web:be5cdccc622e75ca95c150"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;