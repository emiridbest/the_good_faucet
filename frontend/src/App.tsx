import { useMemo } from 'react';
import {
  Button,
  Card,
  ConnectButton,
  InkLayout,
  Link,
  formatContractName
} from 'ui';
import { useBalance, useCallSubscription, useContract, useTx, useWallet } from 'useink';
import { useTxNotifications } from 'useink/notifications';
import {
  decimalToPlanck,
  isPendingSignature,
  pickDecoded,
  planckToDecimalFormatted,
  shouldDisable,
  stringNumberToBN,
} from 'useink/utils';
import metadata from './assets/smart_faucet.json';
import { AZ_TESTNET_ADDRESS } from './constants';

function App() {
  const { account } = useWallet();
  const chainContract = useContract(AZ_TESTNET_ADDRESS, metadata);
  const contractBalance = useBalance({ address: AZ_TESTNET_ADDRESS });
  const userBalance = useBalance(account);
  const giveMe = useTx(chainContract, 'giveMe');
  const getAmount = useCallSubscription<string>(chainContract, 'getAmount', []);
  const amount = pickDecoded(getAmount.result) || '0';
  useTxNotifications(giveMe);

  const planckAmount = useMemo(
    () => decimalToPlanck(stringNumberToBN(amount), { api: chainContract?.contract?.api }) || 0,
    [amount],
  );

  const decimalAmount = useMemo(
    () => planckToDecimalFormatted(stringNumberToBN(amount), { api: chainContract?.contract?.api }) || 0,
    [amount]
  )


  const needsMoreFunds = useMemo(
    () =>
      contractBalance?.freeBalance.lt(
        stringNumberToBN(amount?.toString() || '0'),
      ),
    [contractBalance?.freeBalance, planckAmount],
  );


  return (
    <InkLayout
      className="md:py-12 md:p-6 p-4 h-screen flex items-center justify-center"
      animationSrc="https://raw.githubusercontent.com/paritytech/ink-workshop/d819d10a35b2ac3d2bff4f77a96701a527b3ad3a/frontend/public/dark-sea-creatures.json"
    >
      <div className="flex flex-col justify-center items-center h-full">
        <Card className="mx-auto p-6 flex flex-col w-full max-w-md backdrop-blur-sm bg-opacity-70">

        <h1 className="text-4xl font-bold text-white mb-4">
            The Good Faucet
          </h1>
          <hgroup className="text-sm text-white opacity-80 mb-4">
            <h3>
              Contract Balance:{' '}
              <b className="text-yellow-400">
                {contractBalance
                  ? planckToDecimalFormatted(contractBalance?.freeBalance, {
                      api: chainContract?.contract.api,
                      significantFigures: 4,
                    })
                  : '--'}
              </b>
            </h3>
            <h3>
              Your Balance:{' '}
              <b className="text-green-400">
                {userBalance
                  ? planckToDecimalFormatted(userBalance?.freeBalance, {
                      api: chainContract?.contract.api,
                      significantFigures: 4,
                    })
                  : '--'}
              </b>
            </h3>
          </hgroup>
          {account ? (
            <Button
              disabled={shouldDisable(giveMe) || needsMoreFunds}
              onClick={() => giveMe.signAndSend()}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isPendingSignature(giveMe)
                ? 'Please sign transaction...'
                : shouldDisable(giveMe)
                ? `Sending you ${decimalAmount} ...`
                : `Withdraw ${decimalAmount}`}
            </Button>
          ) : (
            <ConnectButton className="mt-6 bg-green-500 hover:bg-green-600 text-white" />
          )}
          <div className="text-center mt-6">
            {needsMoreFunds && (
              <p className="text-red-500 mb-3">Insufficient funds.</p>
            )}
            <Link href={`https://faucet.test.azero.dev`} target="_blank">
              Add ROC to contract with faucet
            </Link>
          </div>
        </Card>
      </div>
    </InkLayout>
  );
}

export default App;