import { useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { useLocalStorage } from '../lib/useLocalStorage';

const ManualHeader = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();
  const [connected, setConnected, remove] = useLocalStorage<string>(
    'connected',
    ''
  );

  /**
   * In React 18 useEffect runs twice because it mount, unmount and mounts
   * (Strict Mode and just development, not PROD)
   * again so in the future the react team could
   * add a feature lets them remove ui and preserve state
   *
   */
  useEffect(() => {
    if (isWeb3Enabled) return;
    if (connected === 'injected') {
      enableWeb3();
    }
  }, [isWeb3Enabled, connected]);

  useEffect(() => {
    Moralis.onAccountChanged((currentAccount) => {
      console.log(
        '🚀 ~ file: Header.tsx ~ line 26 ~ Moralis.onAccountChanged ~ account',
        account
      );
      if (currentAccount === null) {
        remove();
        deactivateWeb3();
        console.log('No account found');
      }
    });
  }, []);

  return (
    <div>
      {account ? (
        <div>Connected to {account}</div>
      ) : (
        <button
          type="button"
          onClick={async () => {
            await enableWeb3();
            setConnected('injected');
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default ManualHeader;
