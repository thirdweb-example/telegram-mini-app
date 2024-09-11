import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useActiveAccount, useReadContract } from 'thirdweb/react';
import { getBalance } from 'thirdweb/extensions/erc20';
import { getContract } from 'thirdweb';
import { sepolia } from 'thirdweb/chains';
import { client } from '../client';

interface Monster {
  health: number;
  maxHealth: number;
  type: 'goblin' | 'golem' | 'wizard' | 'darkKnight' | 'darkDragon';
  reward: number;
}

const monsterTypes = [
  { type: 'goblin', name: 'Goblin', minHealth: 30, maxHealth: 60, reward: 3, image: '/goblin.png' },
  { type: 'golem', name: 'Golem', minHealth: 61, maxHealth: 75, reward: 5, image: '/golem.png' },
  { type: 'wizard', name: 'Wizard', minHealth: 76, maxHealth: 85, reward: 7, image: '/wizard.png' },
  { type: 'darkKnight', name: 'Dark Knight', minHealth: 86, maxHealth: 95, reward: 10, image: '/darkKnight.png' },
  { type: 'darkDragon', name: 'Dark Dragon', minHealth: 96, maxHealth: 100, reward: 15, image: '/darkDragon.png' },
];

const MiniGame: React.FC = () => {
    const address = useActiveAccount()?.address;
    const [energy, setEnergy] = useState(30);
    const [monster, setMonster] = useState<Monster | null>(null);
    const [showReward, setShowReward] = useState(false);
    const [currentReward, setCurrentReward] = useState(0);
    const [isClaiming, setIsClaiming] = useState(false);

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: "0x3253bac87e39838945Eceb45941f409fB8DB70B9"
    });

    const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract(
        getBalance,
        {
            contract: contract,
            address: address as string,
        }
    )

    const generateMonster = () => {
        const health = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
        const monsterType = monsterTypes.find(m => health >= m.minHealth && health <= m.maxHealth)!;
        setMonster({
            health,
            maxHealth: health,
            type: monsterType.type as 'goblin' | 'golem' | 'wizard' | 'darkKnight' | 'darkDragon',
            reward: monsterType.reward
        });
        setCurrentReward(monsterType.reward);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setEnergy(prevEnergy => Math.min(prevEnergy + 1, 30));
        }, 1000);

        if (!monster) {
            generateMonster();
        }

        return () => clearInterval(timer);
    }, [monster]);

    const handleClick = () => {
        if (energy > 0 && monster) {
        setEnergy(prevEnergy => prevEnergy - 1);
        
        const newHealth = monster.health - 1;
        if (newHealth <= 0) {
            setShowReward(true);
        } else {
            setMonster({ ...monster, health: newHealth });
        }
        }
    };

    const handleRewardClaim = async () => {
        if (!address || isClaiming) return;

        setIsClaiming(true);
        try {
        const response = await fetch('/api/mintToken', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            userWalletAddress: address,
            amount: currentReward,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Claim successful:', result);
            setShowReward(false);
            generateMonster();
        } else if (response.status === 408) {
            console.log('Transaction not mined within timeout period:', result);
        } else {
            console.error('Claim failed:', result);
        }
        } catch (error) {
            console.error('Error claiming reward:', error);
        } finally {
            setIsClaiming(false);
            refetchTokenBalance();
        }
    };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      {tokenBalance && (
        <div className="text-center">
          <p>You have {tokenBalance.displayValue} coins</p>
        </div>
      )}
      {monster && (
        <div className="text-center">
          <div className="relative cursor-pointer" onClick={handleClick}>
            <Image 
              src={monsterTypes.find(m => m.type === monster.type)!.image}
              alt={monster.type}
              width={200}
              height={200}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
              Click to attack!
            </div>
          </div>
          <div className="mt-4">{monsterTypes.find(m => m.type === monster.type)?.name || 'Monster'}</div>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
            <div
              className="bg-red-500 rounded-full h-4"
              style={{ width: `${(monster.health / monster.maxHealth) * 100}%` }}
            ></div>
          </div>
          <div className="mt-1">
            {monster.health}/{monster.maxHealth}
          </div>
        </div>
      )}
      <div className="mt-4 w-64 bg-gray-700 rounded-full h-6">
        <div
          className="bg-green-500 rounded-full h-6"
          style={{ width: `${(energy / 30) * 100}%` }}
        ></div>
      </div>
      <div className="mt-2">Energy: {energy}/30</div>

      {showReward && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-white">{monsterTypes.find(m => m.type === monster!.type)?.name || 'Monster'} Defeated!</h2>
            <p className="text-gray-300 mb-4">You earned {currentReward} coins!</p>
            <button
              className={`mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isClaiming ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleRewardClaim}
              disabled={isClaiming}
            >
              {isClaiming ? 'Claiming...' : 'Claim Reward'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGame;