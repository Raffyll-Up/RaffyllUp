import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { liskSepolia } from 'wagmi/chains';

const project_Id = process.env.NEXT_PUBLIC_RAINBOW_PROJECT_ID;

export const config = getDefaultConfig({
  appName: 'Raffyl Up App',
  projectId: project_Id!,
  chains: [liskSepolia],
  transports: {
    [liskSepolia.id]: http('https://eth-mainnet.g.alchemy.com/v2/...'),
  },
});