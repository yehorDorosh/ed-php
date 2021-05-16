import { APIContextProvider } from './api-context';
import { AuthContextProvider } from './auth-context';

function GlobalProvider(props) {
  return (
    <APIContextProvider>
      <AuthContextProvider>
        {props.children}
      </AuthContextProvider>
    </APIContextProvider>
  );
}

export default GlobalProvider;