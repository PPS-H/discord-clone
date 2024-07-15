import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <SignIn />
    </div>
  );
};

export default SignInPage;
