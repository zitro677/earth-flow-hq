
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newNote: {
    content: string;
  };
  setNewNote: React.Dispatch<React.SetStateAction<{
    content: string;
  }>>;
  handleAddNote: () => void;
}

const NoteDialog: React.FC<NoteDialogProps> = ({
  open,
  onOpenChange,
  newNote,
  setNewNote,
  handleAddNote
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nota al Proyecto</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="note-content">Nota</Label>
            <Textarea 
              id="note-content" 
              value={newNote.content} 
              onChange={e => setNewNote({...newNote, content: e.target.value})}
              placeholder="Ingresa la nota del proyecto" 
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleAddNote} disabled={!newNote.content}>Agregar Nota</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
