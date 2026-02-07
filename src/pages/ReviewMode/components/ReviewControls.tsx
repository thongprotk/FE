import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Edit2,
  SkipForward,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewControlsProps {
  saving: boolean;
  isEditing: boolean;
  onReject: () => void;
  onEdit: () => void;
  onSkip: () => void;
  onAccept: () => void;
}

export const ReviewControls = ({
  saving,
  isEditing,
  onReject,
  onEdit,
  onSkip,
  onAccept,
}: ReviewControlsProps) => {
  if (isEditing) {
    return null;
  }

  return (
    <>
      <Alert className="mb-6">
        <AlertDescription>
          💡 <strong>Tips:</strong> Click the card to flip. You can edit the
          card to improve it, then it will be accepted automatically.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="destructive"
          size="lg"
          onClick={onReject}
          disabled={saving}
          className="w-full"
        >
          {saving ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <XCircle className="mr-2 h-5 w-5" />
          )}
          Reject
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onEdit}
          disabled={saving}
          className="w-full"
        >
          <Edit2 className="mr-2 h-5 w-5" />
          Edit
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onSkip}
          disabled={saving}
          className="w-full"
        >
          <SkipForward className="mr-2 h-5 w-5" />
          Skip
        </Button>
        <Button
          variant="default"
          size="lg"
          onClick={onAccept}
          disabled={saving}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {saving ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <CheckCircle className="mr-2 h-5 w-5" />
          )}
          Accept
        </Button>
      </div>
    </>
  );
};
