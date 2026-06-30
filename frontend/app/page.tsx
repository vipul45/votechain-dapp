'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useReadContract, useWatchContractEvent } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from 'sonner';
import { Plus, Vote, Clock, Users } from 'lucide-react';

// TODO: Update this with your deployed contract address
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3' as `0x${string}`; // Localhost default

// Basic ABI (you should replace with full ABI after compiling)
const VOTECHAIN_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_question", "type": "string"},
      {"internalType": "string[]", "name": "_options", "type": "string[]"},
      {"internalType": "uint256", "name": "_durationInSeconds", "type": "uint256"}
    ],
    "name": "createPoll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_pollId", "type": "uint256"},
      {"internalType": "uint256", "name": "_optionIndex", "type": "uint256"}
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_pollId", "type": "uint256"}],
    "name": "getPoll",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "string", "name": "question", "type": "string"},
      {"internalType": "string[]", "name": "options", "type": "string[]"},
      {"internalType": "uint256", "name": "deadline", "type": "uint256"},
      {"internalType": "bool", "name": "active", "type": "bool"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "totalVotes", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "_pollId", "type": "uint256"}],
    "name": "getPollResults",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

interface Poll {
  id: number;
  question: string;
  options: string[];
  deadline: number;
  active: boolean;
  totalVotes: number;
}

export default function VoteChainApp() {
  const { address, isConnected } = useAccount();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [voteOption, setVoteOption] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    duration: 86400, // 1 day default
  });

  const { writeContractAsync } = useWriteContract();

  // Watch for new polls (simplified - in production use events properly)
  const loadPolls = async () => {
    // For demo, we'll show a message. In real app, fetch from contract or subgraph
    toast.info('In a real deployment, polls would load from the blockchain here.');
  };

  const createPoll = async () => {
    if (!newPoll.question || newPoll.options.some(o => !o)) {
      toast.error('Please fill all fields');
      return;
    }

    setIsCreating(true);
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: VOTECHAIN_ABI,
        functionName: 'createPoll',
        args: [
          newPoll.question,
          newPoll.options,
          BigInt(newPoll.duration),
        ],
      });

      toast.success('Poll created successfully!');
      
      // Reset form
      setNewPoll({ question: '', options: ['', ''], duration: 86400 });
      
      // In real app, refetch polls
      loadPolls();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create poll. Check console for details.');
    } finally {
      setIsCreating(false);
    }
  };

  const castVote = async () => {
    if (!selectedPoll || voteOption === null) return;

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: VOTECHAIN_ABI,
        functionName: 'vote',
        args: [BigInt(selectedPoll.id), BigInt(voteOption)],
      });

      toast.success('Vote cast successfully!');
      setSelectedPoll(null);
      setVoteOption(null);
      loadPolls();
    } catch (error) {
      console.error(error);
      toast.error('Failed to cast vote. You may have already voted or poll expired.');
    }
  };

  const addOption = () => {
    if (newPoll.options.length < 10) {
      setNewPoll({
        ...newPoll,
        options: [...newPoll.options, ''],
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...newPoll.options];
    updated[index] = value;
    setNewPoll({ ...newPoll, options: updated });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">VoteChain</h1>
              <p className="text-xs text-slate-400 -mt-1">Decentralized Voting on Blockchain</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mb-6">
              <Vote className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-3xl font-semibold mb-3">Connect Your Wallet</h2>
            <p className="text-slate-400 max-w-md mb-8">
              Connect your wallet to create polls, vote on proposals, and see real-time results on the blockchain.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Create Poll Section */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-600/10 rounded-xl">
                    <Plus className="w-5 h-5 text-blue-500" />
                  </div>
                  <h2 className="text-xl font-semibold">Create New Poll</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Question</label>
                    <input
                      type="text"
                      value={newPoll.question}
                      onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                      placeholder="What should we build next?"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-slate-400">Options</label>
                      <button
                        onClick={addOption}
                        className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Option
                      </button>
                    </div>
                    
                    {newPoll.options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm mb-2 focus:outline-none focus:border-blue-500"
                      />
                    ))}
                  </div>

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">Duration</label>
                    <select
                      value={newPoll.duration}
                      onChange={(e) => setNewPoll({ ...newPoll, duration: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm"
                    >
                      <option value={3600}>1 Hour</option>
                      <option value={86400}>1 Day</option>
                      <option value={604800}>7 Days</option>
                      <option value={2592000}>30 Days</option>
                    </select>
                  </div>

                  <button
                    onClick={createPoll}
                    disabled={isCreating || !newPoll.question}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors py-3.5 rounded-2xl font-medium flex items-center justify-center gap-2 mt-4"
                  >
                    {isCreating ? 'Creating Poll...' : 'Create Poll on Blockchain'}
                  </button>
                </div>
              </div>
            </div>

            {/* Polls List */}
            <div className="lg:col-span-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" /> Active Polls
                </h2>
                <button 
                  onClick={loadPolls}
                  className="text-sm px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center gap-2"
                >
                  Refresh Polls
                </button>
              </div>

              {polls.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
                  <Clock className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                  <p className="text-slate-400">No polls found yet.</p>
                  <p className="text-sm text-slate-500 mt-1">Create your first poll on the left!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {polls.map((poll) => (
                    <div 
                      key={poll.id} 
                      onClick={() => setSelectedPoll(poll)}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 cursor-pointer transition-all"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold pr-4">{poll.question}</h3>
                        <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full whitespace-nowrap">
                          {poll.totalVotes} votes
                        </span>
                      </div>
                      <div className="flex gap-2 text-xs text-slate-400">
                        <span>{poll.options.length} options</span>
                        <span>•</span>
                        <span>Ends in {Math.floor((poll.deadline - Date.now()/1000)/3600)} hours</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Voting Modal */}
      {selectedPoll && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold mb-6 pr-8">{selectedPoll.question}</h3>
            
            <div className="space-y-3 mb-6">
              {selectedPoll.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setVoteOption(index)}
                  className={`w-full text-left px-5 py-3.5 rounded-2xl border transition-all ${
                    voteOption === index 
                      ? 'bg-blue-600 border-blue-500' 
                      : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => { setSelectedPoll(null); setVoteOption(null); }}
                className="flex-1 py-3 rounded-2xl border border-slate-700 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button 
                onClick={castVote}
                disabled={voteOption === null}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 rounded-2xl font-medium"
              >
                Cast Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
