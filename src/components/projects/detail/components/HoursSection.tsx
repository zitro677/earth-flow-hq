
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Edit2 } from "lucide-react";

interface HoursSectionProps {
  hoursLogged: number;
  estimatedHours: number;
  onSaveHours: (hoursLogged: number, estimatedHours: number) => void;
}

const HoursSection: React.FC<HoursSectionProps> = ({
  hoursLogged,
  estimatedHours,
  onSaveHours
}) => {
  const [showHoursEdit, setShowHoursEdit] = useState(false);
  const [hoursLoggedValue, setHoursLoggedValue] = useState(hoursLogged);
  const [hoursValue, setHoursValue] = useState(estimatedHours);

  const saveHours = () => {
    onSaveHours(hoursLoggedValue, hoursValue);
    setShowHoursEdit(false);
  };

  return (
    <div className="flex items-start gap-2">
      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Horas</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowHoursEdit(!showHoursEdit)}
            className="h-7 px-2"
          >
            {showHoursEdit ? "Cancelar" : <Edit2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
        {showHoursEdit ? (
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Horas Registradas</label>
                <Input
                  type="number"
                  value={hoursLoggedValue}
                  onChange={(e) => setHoursLoggedValue(Number(e.target.value))}
                  className="h-8"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Horas Estimadas</label>
                <Input
                  type="number"
                  value={hoursValue}
                  onChange={(e) => setHoursValue(Number(e.target.value))}
                  className="h-8"
                />
              </div>
            </div>
            <Button size="sm" onClick={saveHours} className="w-full">Guardar Horas</Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {hoursLogged} de {estimatedHours} hrs registradas
          </p>
        )}
      </div>
    </div>
  );
};

export default HoursSection;
