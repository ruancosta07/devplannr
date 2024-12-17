
import { Metadata } from "next";
import LoginComp from "./_components/Login";


export const metadata:Metadata = {
  title: "Devplannr | Login"
}

const Login = () => {

  return (
    <>
     <LoginComp/>
    </>
  );
};

export default Login;
