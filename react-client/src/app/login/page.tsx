import { AuthScreen } from "@/components/pulseboard/auth-screen";

export default async function LoginPage(props: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const searchParams = await props.searchParams;

  return <AuthScreen mode="login" initialNotice={searchParams.notice} />;
}
