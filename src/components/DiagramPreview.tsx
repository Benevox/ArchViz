
'use client';
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

let mermaidInitialized = false;

interface DiagramPreviewProps {
  diagramCode: string | null;
  isLoading: boolean;
}

const DiagramPreview: React.FC<DiagramPreviewProps> = ({ diagramCode, isLoading }) => {
  const mermaidContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  // Generate a unique ID for each instance to prevent Mermaid conflicts
  const [uniqueId] = useState(() => `mermaid-diagram-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    // Initialize Mermaid on client-side
    if (typeof window !== 'undefined' && !mermaidInitialized) {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark', // For dark theme. Other options: 'default', 'neutral', 'forest'
          // securityLevel: 'loose', // Consider implications if diagrams can include scripts
          // darkMode: true, // this seems not to be an option anymore, theme 'dark' should handle it
          // themeVariables: { // Example: For 'base' theme customization
          //   background: getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#303030',
          //   primaryColor: getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#3F51B5',
          //   primaryTextColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-foreground').trim() || '#FFFFFF',
          //   lineColor: '#A0A0A0',
          //   textColor: getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#FFFFFF',
          // }
        });
        mermaidInitialized = true;
      } catch (e) {
        console.error("Failed to initialize Mermaid:", e);
        // toast({ variant: "destructive", title: "Initialization Error", description: "Could not initialize diagramming library." });
      }
    }
  }, []);


  useEffect(() => {
    const renderMermaid = async () => {
      if (diagramCode && mermaidContainerRef.current && mermaidInitialized) {
        // Clear previous content to prevent ghosting or ID conflicts
        mermaidContainerRef.current.innerHTML = '';
        // Add a temporary div for mermaid to render into, then extract SVG
        // This is a common pattern if mermaid.render directly to an existing complex div causes issues
        // However, mermaid.render's first argument is an ID for the svg, not the container.
        try {
          // console.log(`Rendering Mermaid ID: ${uniqueId} with code:\n${diagramCode}`);
          const { svg, bindFunctions } = await mermaid.render(uniqueId, diagramCode);
          if (mermaidContainerRef.current) {
            mermaidContainerRef.current.innerHTML = svg;
            if (bindFunctions) {
              bindFunctions(mermaidContainerRef.current);
            }
          }
        } catch (error: any) {
          console.error('Mermaid rendering error:', error);
          let errorMessage = 'Could not render diagram. ';
          if (error && typeof error.str === 'string') {
            errorMessage += `Details: ${error.str}`;
          } else if (error && error.message) {
            errorMessage += `Details: ${error.message}`;
          } else {
            errorMessage += 'Invalid Mermaid syntax or unknown error.';
          }
          
          toast({
            variant: "destructive",
            title: "Diagram Error",
            description: errorMessage,
          });

          if (mermaidContainerRef.current) {
            // Display error and code in a readable format
            mermaidContainerRef.current.innerHTML = `
              <div class="p-4 text-destructive-foreground bg-destructive rounded-md w-full max-w-xl mx-auto text-left">
                <h4 class="font-semibold mb-2">Diagram Rendering Failed</h4>
                <p class="text-sm mb-2">${errorMessage}</p>
                <h5 class="font-semibold mt-4 mb-1 text-xs">Provided Code:</h5>
                <pre class="text-xs whitespace-pre-wrap break-all bg-black/20 p-2 rounded max-h-60 overflow-auto">${diagramCode}</pre>
              </div>`;
          }
        }
      } else if (mermaidContainerRef.current) {
        mermaidContainerRef.current.innerHTML = ''; // Clear if no code or not initialized
      }
    };

    if (mermaidInitialized) {
       renderMermaid();
    } else {
      // If mermaid is not yet initialized, wait a bit. This is a simple retry.
      // A more robust solution might use a state variable for initialization.
      const initTimeout = setTimeout(() => {
        if (mermaidInitialized) renderMermaid();
      }, 500);
      return () => clearTimeout(initTimeout);
    }
  }, [diagramCode, toast, uniqueId]);

  return (
    <Card className={cn("h-full flex flex-col shadow-xl rounded-lg", isLoading && "animate-pulse")}>
      <CardHeader className="py-4 px-6">
        <CardTitle className="text-xl font-semibold">Architecture Diagram</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex items-center justify-center overflow-auto p-1 bg-card rounded-b-lg min-h-[300px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center p-4">
            <Skeleton className="w-full h-full max-w-2xl max-h-[400px]" />
          </div>
        ) : diagramCode ? (
          <div 
            ref={mermaidContainerRef} 
            className="w-full h-full flex items-center justify-center p-2 [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto"
            data-ai-hint="network diagram"
          >
            {/* SVG will be injected here by Mermaid */}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8" data-ai-hint="empty state computer">
            <Eye size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Diagram Appears Here</p>
            <p className="text-sm">
              Enter a description in the left panel or upload a requirements file to generate an architecture diagram.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiagramPreview;
