import { AuthProvider } from "./Auth/AuthContext";
import { Controller } from "./Auth/Controller";


function App() {
  return (
    <AuthProvider>
        <Controller/>
    </AuthProvider>
  );
}

export default App;