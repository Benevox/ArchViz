
'use client';

import React, { useState, useCallback } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Menu, Brain, FileText, Settings2, Eye, MessageSquare, Info, Loader2, SlidersHorizontal, UploadCloud, Bot, ListChecks, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import type { GenerateDiagramOutput } from '@/ai/flows/generate-diagram';
import { generateDiagram } from '@/ai/flows/generate-diagram';
import type { ExtractRequirementsFromFileOutput } from '@/ai/flows/extract-requirements';
import { extractRequirementsFromFile } from '@/ai/flows/extract-requirements';
import type { GenerateUserFlowOutput } from '@/ai/flows/generate-user-flow';
import { generateUserFlow } from '@/ai/flows/generate-user-flow';
import type { ExplainComponentRationaleOutput } from '@/ai/flows/explain-component-rationale';
import { explainComponentRationale } from '@/ai/flows/explain-component-rationale';

import DiagramPreview from './DiagramPreview';
import CloudPlatformSelector from './CloudPlatformSelector';

type CloudPlatform = 'aws' | 'azure' | 'gcp' | 'generic';

export default function ArchVizApp() {
  const { toast } = useToast();

  // State for AI-generated content
  const [diagramCode, setDiagramCode] = useState<string | null>(null);
  const [extractedRequirements, setExtractedRequirements] = useState<string | null>(null);
  const [userFlow, setUserFlow] = useState<string | null>(null);
  const [componentRationale, setComponentRationale] = useState<string | null>(null);
  
  // State for inputs
  const [naturalLanguageInput, setNaturalLanguageInput] = useState<string>('');
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedCloudPlatform, setSelectedCloudPlatform] = useState<CloudPlatform>('generic');
  const [componentForRationale, setComponentForRationale] = useState<string>('');
  const [currentArchitectureDescription, setCurrentArchitectureDescription] = useState<string | null>(null);

  // Loading states
  const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
  const [isExtractingRequirements, setIsExtractingRequirements] = useState(false);
  const [isGeneratingUserFlow, setIsGeneratingUserFlow] = useState(false);
  const [isGeneratingRationale, setIsGeneratingRationale] = useState(false);

  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  const handleGenerateDiagram = useCallback(async (description?: string) => {
    const inputDescription = description || naturalLanguageInput;
    if (!inputDescription.trim()) {
      toast({ variant: "destructive", title: "Input Error", description: "Please provide a description for the diagram." });
      return;
    }
    setIsGeneratingDiagram(true);
    setDiagramCode(null); // Clear previous diagram
    setCurrentArchitectureDescription(inputDescription);
    try {
      const result: GenerateDiagramOutput = await generateDiagram({ description: inputDescription });
      setDiagramCode(result.diagram);
      toast({ title: "Diagram Generated", description: "Architecture diagram successfully generated." });
    } catch (error: any) {
      console.error("Error generating diagram:", error);
      toast({ variant: "destructive", title: "Diagram Generation Failed", description: error.message || "Could not generate diagram." });
    } finally {
      setIsGeneratingDiagram(false);
    }
  }, [naturalLanguageInput, toast]);

  const handleExtractRequirements = useCallback(async () => {
    if (!fileDataUri) {
      toast({ variant: "destructive", title: "File Error", description: "Please select a file to extract requirements." });
      return;
    }
    setIsExtractingRequirements(true);
    setExtractedRequirements(null);
    try {
      const result: ExtractRequirementsFromFileOutput = await extractRequirementsFromFile({ fileDataUri });
      setExtractedRequirements(result.extractedRequirements);
      setCurrentArchitectureDescription(result.extractedRequirements); // Use extracted text as description
      toast({ title: "Requirements Extracted", description: `Successfully extracted requirements from ${fileName}.` });
      // Optionally, auto-generate diagram from extracted requirements
      handleGenerateDiagram(result.extractedRequirements);
    } catch (error: any) {
      console.error("Error extracting requirements:", error);
      toast({ variant: "destructive", title: "Extraction Failed", description: error.message || "Could not extract requirements." });
    } finally {
      setIsExtractingRequirements(false);
    }
  }, [fileDataUri, fileName, toast, handleGenerateDiagram]);

  const handleGenerateUserFlow = useCallback(async () => {
    if (!currentArchitectureDescription) {
      toast({ variant: "destructive", title: "Input Error", description: "No architecture description available to generate user flow. Please generate a diagram first." });
      return;
    }
    setIsGeneratingUserFlow(true);
    setUserFlow(null);
    try {
      const result: GenerateUserFlowOutput = await generateUserFlow({ architectureDiagram: currentArchitectureDescription });
      setUserFlow(result.userFlowExplanation);
      toast({ title: "User Flow Generated", description: "User flow explanation successfully generated." });
    } catch (error: any) {
      console.error("Error generating user flow:", error);
      toast({ variant: "destructive", title: "User Flow Generation Failed", description: error.message || "Could not generate user flow." });
    } finally {
      setIsGeneratingUserFlow(false);
    }
  }, [currentArchitectureDescription, toast]);

  const handleExplainRationale = useCallback(async () => {
    if (!currentArchitectureDescription) {
      toast({ variant: "destructive", title: "Input Error", description: "No architecture description available. Please generate a diagram first." });
      return;
    }
    if (!componentForRationale.trim()) {
      toast({ variant: "destructive", title: "Input Error", description: "Please enter a component name." });
      return;
    }
    setIsGeneratingRationale(true);
    setComponentRationale(null);
    try {
      const result: ExplainComponentRationaleOutput = await explainComponentRationale({
        architectureDiagramDescription: currentArchitectureDescription,
        component: componentForRationale,
      });
      setComponentRationale(result.rationale);
      toast({ title: "Rationale Explained", description: `Rationale for ${componentForRationale} successfully generated.` });
    } catch (error: any)
    {
      console.error("Error explaining rationale:", error);
      toast({ variant: "destructive", title: "Rationale Generation Failed", description: error.message || "Could not explain rationale." });
    } finally {
      setIsGeneratingRationale(false);
    }
  }, [currentArchitectureDescription, componentForRationale, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Basic validation for file types (client-side)
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) {
          toast({ variant: "destructive", title: "Invalid File Type", description: "Please upload PDF, XLSX, DOCX, or TXT files." });
          event.target.value = ''; // Reset file input
          setFileDataUri(null);
          setFileName(null);
          return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFileDataUri(e.target?.result as string);
        setFileName(file.name);
      };
      reader.onerror = () => {
        toast({ variant: "destructive", title: "File Read Error", description: "Could not read the selected file." });
        setFileDataUri(null);
        setFileName(null);
      };
      reader.readAsDataURL(file);
    } else {
        setFileDataUri(null);
        setFileName(null);
    }
  };
  
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <Sidebar className="border-r border-sidebar-border w-[320px]" collapsible="icon" variant="sidebar">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Bot size={28} className="text-primary" />
            <h1 className="text-2xl font-semibold">ArchViz</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-6">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Brain size={20} /> Describe Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="e.g., A three-tier web application with a load balancer, web servers, app servers, and a database..."
                  value={naturalLanguageInput}
                  onChange={(e) => setNaturalLanguageInput(e.target.value)}
                  rows={5}
                  className="resize-none"
                />
                <Button onClick={() => handleGenerateDiagram()} disabled={isGeneratingDiagram || isExtractingRequirements} className="w-full">
                  {isGeneratingDiagram ? <Loader2 className="animate-spin mr-2" /> : <Eye className="mr-2" />}
                  Generate Diagram
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><UploadCloud size={20} /> Upload Requirements</CardTitle>
                <CardDescription>Extract requirements from PDF, DOCX, XLSX, TXT.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileChange} 
                  accept=".pdf,.docx,.xlsx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain"
                />
                {fileName && <p className="text-sm text-muted-foreground">Selected: {fileName}</p>}
                <Button onClick={handleExtractRequirements} disabled={!fileDataUri || isExtractingRequirements || isGeneratingDiagram} className="w-full">
                  {isExtractingRequirements ? <Loader2 className="animate-spin mr-2" /> : <ListChecks className="mr-2" />}
                  Extract & Generate
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Settings2 size={20} /> Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <CloudPlatformSelector
                  selectedPlatform={selectedCloudPlatform}
                  onPlatformChange={setSelectedCloudPlatform}
                />
              </CardContent>
            </Card>
          </div>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-muted-foreground text-center">© 2024 ArchViz</p>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 border-b flex items-center justify-between h-[69px]"> {/* Match SidebarHeader height */}
          <SidebarTrigger>
            <Menu />
          </SidebarTrigger>
          <h2 className="text-xl font-medium">Diagram Preview & Analysis</h2>
          <Button variant="outline" onClick={() => setIsRightPanelOpen(true)} aria-label="Open analysis panel">
            <SlidersHorizontal size={20} className="mr-2" /> Analysis
          </Button>
        </header>
        <main className="flex-1 p-4 overflow-auto bg-muted/20">
          <DiagramPreview diagramCode={diagramCode} isLoading={isGeneratingDiagram || isExtractingRequirements} />
        </main>
      </SidebarInset>

      <Sheet open={isRightPanelOpen} onOpenChange={setIsRightPanelOpen}>
        <SheetContent className="sm:max-w-lg w-[90vw] p-0 flex flex-col">
          <SheetHeader className="p-6 border-b">
            <SheetTitle className="text-xl">Analysis & Explanations</SheetTitle>
          </SheetHeader>
          <Tabs defaultValue="user-flow" className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="m-4">
              <TabsTrigger value="user-flow" className="flex-1"><MessageSquare size={16} className="mr-1.5" /> User Flow</TabsTrigger>
              <TabsTrigger value="rationale" className="flex-1"><HelpCircle size={16} className="mr-1.5" /> Rationale</TabsTrigger>
              <TabsTrigger value="requirements" className="flex-1"><FileText size={16} className="mr-1.5" /> Requirements</TabsTrigger>
            </TabsList>
            <ScrollArea className="flex-1 p-0">
              <div className="px-6 pb-6 space-y-4">
              <TabsContent value="user-flow">
                <Card>
                  <CardHeader>
                    <CardTitle>User Flow Explanation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={handleGenerateUserFlow} disabled={isGeneratingUserFlow || !currentArchitectureDescription} className="w-full">
                      {isGeneratingUserFlow ? <Loader2 className="animate-spin mr-2" /> : <Brain className="mr-2" />}
                      Generate User Flow
                    </Button>
                    {isGeneratingUserFlow && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="animate-spin mr-2" />Generating...</p>}
                    {userFlow && <pre className="text-sm whitespace-pre-wrap p-3 bg-muted rounded-md max-h-96 overflow-y-auto">{userFlow}</pre>}
                    {!userFlow && !isGeneratingUserFlow && <p className="text-sm text-muted-foreground">Click button to generate user flow based on the current architecture.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="rationale">
                <Card>
                  <CardHeader>
                    <CardTitle>Component Rationale</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="component-name">Component Name</Label>
                      <Input
                        id="component-name"
                        placeholder="e.g., Load Balancer, Kafka"
                        value={componentForRationale}
                        onChange={(e) => setComponentForRationale(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleExplainRationale} disabled={isGeneratingRationale || !currentArchitectureDescription || !componentForRationale} className="w-full">
                      {isGeneratingRationale ? <Loader2 className="animate-spin mr-2" /> : <Brain className="mr-2" />}
                      Explain Rationale
                    </Button>
                    {isGeneratingRationale && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="animate-spin mr-2" />Generating...</p>}
                    {componentRationale && <pre className="text-sm whitespace-pre-wrap p-3 bg-muted rounded-md max-h-96 overflow-y-auto">{componentRationale}</pre>}
                    {!componentRationale && !isGeneratingRationale && <p className="text-sm text-muted-foreground">Enter component name and click button for rationale.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="requirements">
                 <Card>
                  <CardHeader>
                    <CardTitle>Extracted Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isExtractingRequirements && <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="animate-spin mr-2" />Extracting...</p>}
                    {extractedRequirements && <pre className="text-sm whitespace-pre-wrap p-3 bg-muted rounded-md max-h-[500px] overflow-y-auto">{extractedRequirements}</pre>}
                    {!extractedRequirements && !isExtractingRequirements && <p className="text-sm text-muted-foreground">Upload a file to see extracted requirements here.</p>}
                  </CardContent>
                </Card>
              </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
          <SheetFooter className="p-6 border-t">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
