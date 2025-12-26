
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

interface NotesTabProps {
  notes: any[];
  onAddNoteClick: () => void;
}

const NotesTab: React.FC<NotesTabProps> = ({ notes, onAddNoteClick }) => {
  return (
    <Card className="card-shadow">
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle>Project Notes</CardTitle>
        <Button size="sm" className="gap-1" onClick={onAddNoteClick}>
          <Plus className="h-4 w-4" />
          <span>Add Note</span>
        </Button>
      </CardHeader>
      <CardContent>
        {notes && notes.length > 0 ? (
          <div className="space-y-6">
            {notes.map((note: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium">{note.author}</h3>
                  <p className="text-sm text-muted-foreground">
                    {note.date}
                  </p>
                </div>
                <p className="text-muted-foreground">{note.content}</p>
                {index < notes.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No notes added yet</p>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesTab;
