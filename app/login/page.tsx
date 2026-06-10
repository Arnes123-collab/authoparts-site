import LoginForm from "@/components/LoginForm";

type LoginPageProps = {
  searchParams?: {
    next?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const nextPath = searchParams?.next || "/admin";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <p className="text-accent font-semibold mb-3">
            Защищённый вход
          </p>

          <h1 className="text-4xl font-bold mb-4">
            Вход в CRM
          </h1>

          <p className="text-secondaryText mb-8">
            Введите пароль администратора, чтобы открыть клиентскую базу.
          </p>

          <LoginForm nextPath={nextPath} />
        </div>
      </div>
    </main>
  );
}
