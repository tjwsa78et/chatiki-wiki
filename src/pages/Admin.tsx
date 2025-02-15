
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import { useAuth } from "@/layouts/authContext";

const Admin = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const auth = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const credentials = localStorage.getItem("adminCredentials");
      if (!credentials) throw new Error("No credentials found");

      const response = await fetch("https://tjwsa78et.app.n8n.cloud/webhook/documents", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Authentication failed. Please log in again.");
          localStorage.removeItem("adminCredentials");
          auth.resetAuthentication();
          return;
        }
        throw new Error("Upload failed");
      }

      toast.success(`Successfully uploaded ${acceptedFiles.length} files`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [auth]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isUploading,
  });

  const handleLogout = () => {
    localStorage.removeItem("adminCredentials");
    navigate("/");
    toast.success("Successfully logged out");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Management Console</h1>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        <Card
          {...getRootProps()}
          className={`p-12 text-center backdrop-blur-sm bg-white/90 shadow-xl border-2 border-dashed ${
            isDragActive ? "border-blue-500 bg-blue-50/50" : "border-gray-300"
          } rounded-lg cursor-pointer transition-all`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
              {isUploading ? (
                <Loader2 className="w-8 h-8 text-gray-500 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium">
                {isDragActive
                  ? "Drop the files here"
                  : "Drag and drop files here, or click to select files"}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Upload documents to update the knowledge base
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
