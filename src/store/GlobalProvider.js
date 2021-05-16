import { APIContextProvider } from './api-context';
import { AuthContextProvider } from './auth-context';
import { ModalContextProvider } from './modal-context';

function GlobalProvider(props) {
  return (
    <APIContextProvider>
      <AuthContextProvider>
        <ModalContextProvider>
          {props.children}
        </ModalContextProvider>
      </AuthContextProvider>
    </APIContextProvider>
  );
}

export default GlobalProvider;