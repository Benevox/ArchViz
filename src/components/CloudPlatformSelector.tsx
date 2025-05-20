
'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Cloud, Server, Database, Network } from 'lucide-react'; // Generic icons

interface CloudPlatformSelectorProps {
  selectedPlatform: string;
  onPlatformChange: (platform: 'aws' | 'azure' | 'gcp' | 'generic') => void;
}

const platforms = [
  { value: 'generic', label: 'Generic Cloud', icon: <Cloud className="mr-2 h-4 w-4" /> },
  { value: 'aws', label: 'Amazon Web Services', icon: <Server className="mr-2 h-4 w-4" /> }, // Replace with actual AWS icon if available/allowed
  { value: 'azure', label: 'Microsoft Azure', icon: <Database className="mr-2 h-4 w-4" /> }, // Replace with actual Azure icon
  { value: 'gcp', label: 'Google Cloud Platform', icon: <Network className="mr-2 h-4 w-4" /> }, // Replace with actual GCP icon
];

const CloudPlatformSelector: React.FC<CloudPlatformSelectorProps> = ({ selectedPlatform, onPlatformChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="cloud-platform">Cloud Platform</Label>
      <Select
        value={selectedPlatform}
        onValueChange={(value) => onPlatformChange(value as 'aws' | 'azure' | 'gcp' | 'generic')}
      >
        <SelectTrigger id="cloud-platform" className="w-full">
          <SelectValue placeholder="Select a platform" />
        </SelectTrigger>
        <SelectContent>
          {platforms.map((platform) => (
            <SelectItem key={platform.value} value={platform.value}>
              <div className="flex items-center">
                {platform.icon}
                {platform.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Platform selection may influence icon styles in future updates. Currently, AI uses generic representations.
      </p>
    </div>
  );
};

export default CloudPlatformSelector;
