import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ReplyAll, Edit, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Template, InsertTemplate } from "@shared/schema";

export default function ResponseTemplates() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [templateForm, setTemplateForm] = useState<Partial<InsertTemplate>>({
    name: "",
    template: "",
    variables: "",
    type: "mention"
  });

  // Fetch templates
  const {
    data: templates,
    isLoading
  } = useQuery<Template[]>({
    queryKey: ['/api/templates']
  });

  // Create template mutation
  const createTemplate = useMutation({
    mutationFn: async (template: InsertTemplate) => {
      const res = await apiRequest('POST', '/api/templates', template);
      return res.json();
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: "Template Created",
        description: "New response template has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update template mutation
  const updateTemplate = useMutation({
    mutationFn: async ({ id, template }: { id: number; template: Partial<InsertTemplate> }) => {
      const res = await apiRequest('PUT', `/api/templates/${id}`, template);
      return res.json();
    },
    onSuccess: () => {
      setIsDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/templates'] });
      toast({
        title: "Template Updated",
        description: "Response template has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleOpenDialog = (template?: Template) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateForm({
        name: template.name,
        template: template.template,
        variables: template.variables,
        type: template.type
      });
    } else {
      setEditingTemplate(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setTemplateForm({
      name: "",
      template: "",
      variables: "",
      type: "mention"
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTemplateForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setTemplateForm(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = () => {
    if (!templateForm.name || !templateForm.template) {
      toast({
        title: "Validation Error",
        description: "Name and template content are required.",
        variant: "destructive",
      });
      return;
    }

    if (editingTemplate) {
      updateTemplate.mutate({
        id: editingTemplate.id,
        template: templateForm as InsertTemplate
      });
    } else {
      createTemplate.mutate(templateForm as InsertTemplate);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <ReplyAll className="w-5 h-5 text-twitterMediumGray mr-2" />
            Response Templates
          </h2>
          <p className="text-center py-4">Loading templates...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <ReplyAll className="w-5 h-5 text-twitterMediumGray mr-2" />
            Response Templates
          </h2>
          <div className="space-y-4">
            {templates?.map((template) => (
              <div key={template.id} className="p-4 border border-gray-200 rounded-lg bg-twitterLightGray">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{template.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-twitterBlue hover:text-blue-600 transition"
                    onClick={() => handleOpenDialog(template)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 font-comic text-gray-800">
                  {template.template}
                </div>
                <div className="mt-2 flex justify-between text-xs text-twitterMediumGray">
                  <span>Variables: {template.variables}</span>
                  <span>Type: {template.type}</span>
                </div>
              </div>
            ))}
            
            <Button 
              className="w-full border border-dashed border-gray-300 text-twitterMediumGray p-3 rounded-lg hover:bg-twitterLightGray transition"
              variant="ghost"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Template
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Edit Response Template" : "Create New Template"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input 
                id="name"
                name="name"
                value={templateForm.name}
                onChange={handleInputChange}
                placeholder="e.g., When mentioned directly"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">Response Template</Label>
              <Textarea 
                id="template"
                name="template"
                value={templateForm.template}
                onChange={handleInputChange}
                placeholder="e.g., *wags tail* Hello {{user}}! Much excite!"
                className="h-24 font-comic"
              />
              <p className="text-xs text-gray-500">
                Use double curly braces syntax for dynamic content. Example: {"{{user}}, {{bonk_price}}"}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="variables">Variables (comma separated)</Label>
              <Input 
                id="variables"
                name="variables"
                value={templateForm.variables}
                onChange={handleInputChange}
                placeholder="e.g., {{user}}, {{bonk_price}}"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Template Type</Label>
              <Select 
                value={templateForm.type} 
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mention">When mentioned directly</SelectItem>
                  <SelectItem value="keyword">When $bonk is mentioned</SelectItem>
                  <SelectItem value="scheduled">Scheduled tweets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!templateForm.name || !templateForm.template || createTemplate.isPending || updateTemplate.isPending}
            >
              {editingTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
