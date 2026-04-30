import { LoginForm } from "@/components/admin/LoginForm";
import { Store } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">BleeStore Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
