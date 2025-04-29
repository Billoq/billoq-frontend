'use client';
import React, { useState, useEffect } from 'react';
import { useAppKitAccount, useDisconnect as useAppKitDisconnect, useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect as useWagmiDisconnect } from "wagmi";

const SettingsPage: React.FC = () => {
  // Get wallet address from AppKit and Wagmi
  const { address: appkitAddress, isConnected: appkitIsConnected } = useAppKitAccount();
  const { address: wagmiAddress, isConnected: wagmiIsConnected } = useAccount();
  
  // AppKit disconnect
  const { disconnect: appkitDisconnect } = useAppKitDisconnect();
  const { close } = useAppKit();
  
  // Wagmi disconnect
  const { disconnect: wagmiDisconnect } = useWagmiDisconnect();
  
  // Use the first available address
  const walletAddress = appkitAddress || wagmiAddress;
  const isConnected = appkitIsConnected || wagmiIsConnected;
  
  // Handle wallet disconnect
  const handleDisconnect = () => {
    try {
      if (appkitIsConnected) {
        appkitDisconnect();
      }
      if (wagmiIsConnected) {
        wagmiDisconnect();
      }
      close();
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  };
  
  // State for user data
  const [userData, setUserData] = useState({
    username: '',
    walletAddress: '',
    email: '',
  });

  // Update userData when wallet address changes
  useEffect(() => {
    if (walletAddress) {
      // Format the wallet address for display username if none exists
      const formattedAddress = walletAddress ? 
        `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';
      
      setUserData({
        username: formattedAddress, // Default to formatted address
        walletAddress: walletAddress,
        email: '',
      });
    }
  }, [walletAddress]);

  // State for settings form
  const [displayUsername, setDisplayUsername] = useState(userData.username);
  const [emailAddress, setEmailAddress] = useState(userData.email || '');
  const [notifications, setNotifications] = useState({
    billDueAlerts: true,
    paymentSuccessAlerts: true,
    promotionsUpdates: false
  });

  // Update display username when userData changes
  useEffect(() => {
    setDisplayUsername(userData.username);
  }, [userData.username]);

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Handle save changes
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  
  const handleSaveChanges = () => {
    setIsSaving(true);
    
    // Simulate API call to save changes
    setTimeout(() => {
      // Update the user data
      setUserData(prev => ({
        ...prev,
        username: displayUsername,
        email: emailAddress
      }));
      
      setSaveMessage('Settings saved successfully!');
      setIsSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="flex-1 p-8 bg-gray-900 text-white">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account, security, and crypto preferences.</p>
      </div>

      {/* Account Profile Section */}
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Account Profile</h2>
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Connected Wallets</label>
          <div className="flex flex-col space-y-2">
            <div className="bg-gray-800 border border-gray-700 rounded p-3 text-sm w-80">
              {userData.walletAddress || 'No wallet connected'}
            </div>
            {isConnected && (
              <button 
                onClick={handleDisconnect}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors text-sm w-fit"
              >
                Disconnect Wallet
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Profile Settings</h3>
          
          <div className="space-y-4 mt-4">
            <div>
              <label htmlFor="displayUsername" className="block text-gray-400 mb-2">Display Username</label>
              <input
                type="text"
                id="displayUsername"
                value={displayUsername}
                onChange={(e) => setDisplayUsername(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded p-3 text-sm w-80 text-white"
                placeholder="Enter display username"
              />
            </div>
            
            <div>
              <label htmlFor="emailAddress" className="block text-gray-400 mb-2">Email Address (optional)</label>
              <input
                type="email"
                id="emailAddress"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded p-3 text-sm w-80 text-white"
                placeholder="Enter email address"
              />
              <p className="text-xs text-gray-500 mt-1">Used for notifications and account recovery</p>
            </div>
            
            <div className="pt-2">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm shadow-[0_0_15px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed w-fit"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                
                {saveMessage && (
                  <p className="text-green-500 text-sm">{saveMessage}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Section */}
      <div className="mt-8">
        <h2 className="text-xl font-medium mb-4">Notification</h2>
        <div>
          <p className="text-gray-400 mb-4">Enable /Disable</p>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="billDueAlerts"
                checked={notifications.billDueAlerts}
                onChange={() => handleNotificationChange('billDueAlerts')}
                className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="billDueAlerts" className="ml-2 text-sm">
                Bill Due Alerts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="paymentSuccessAlerts"
                checked={notifications.paymentSuccessAlerts}
                onChange={() => handleNotificationChange('paymentSuccessAlerts')}
                className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="paymentSuccessAlerts" className="ml-2 text-sm">
                Payment Success Alerts
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="promotionsUpdates"
                checked={notifications.promotionsUpdates}
                onChange={() => handleNotificationChange('promotionsUpdates')}
                className="h-4 w-4 rounded bg-gray-800 border-gray-700 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="promotionsUpdates" className="ml-2 text-sm">
                Promotions/Updates
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;