"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Check, X } from "lucide-react";
import axios from "axios";

const STATUS_OPTIONS = ["Open", "In Progress", "Resolved", "Closed", "Pending"];

export function TicketSidebar({ ticketid }) {
  const [ticket, setTicket] = useState(null);

  const [editing, setEditing] = useState({
    title: false,
    description: false,
    status: false,
  });
  const [editedValues, setEditedValues] = useState({
    title: "",
    description: "",
    status: "",
  });

  const getTicket = async (id) => {
    if (id == null) {
      return;
    }
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${id}`
      );
      setTicket(response.data);
    } catch (error) {
      console.error("Error fetching ticket:", error);
    }
  };

  useEffect(() => {
    getTicket(ticketid);
  }, [ticketid]);

  if (ticketid == null || ticket == null) {
    return null;
  }

  const handleEdit = (field) => {
    setEditing((prev) => ({ ...prev, [field]: true }));
    setEditedValues((prev) => ({ ...prev, [field]: ticket[field] }));
  };

  const handleCancel = (field) => {
    setEditing((prev) => ({ ...prev, [field]: false }));
    setEditedValues((prev) => ({ ...prev, [field]: ticket[field] }));
  };

  const handleSave = async (field) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/tickets/${ticket.id}`,
        {
          [field]: editedValues[field],
        }
      );
      setEditing((prev) => ({ ...prev, [field]: false }));
      getTicket(ticketid);
    } catch (error) {
      console.error(`Error updating ticket ${field}:`, error);
      // You might want to show an error message to the user here
    }
  };

  const renderEditableField = (field, component) => {
    if (!editing[field]) {
      return (
        <div className="flex justify-between items-start">
          {field === "status" ? (
            <Badge variant="secondary">{ticket[field]}</Badge>
          ) : (
            <p className="text-sm text-muted-foreground">{ticket[field]}</p>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(field)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {component}
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => handleSave(field)}
            className="h-8 px-2"
          >
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancel(field)}
            className="h-8 px-2"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full rounded-none border-l">
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Title</h3>
              {renderEditableField(
                "title",
                <Input
                  value={editedValues.title}
                  onChange={(e) =>
                    setEditedValues((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full"
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              {renderEditableField(
                "description",
                <Textarea
                  value={editedValues.description}
                  onChange={(e) =>
                    setEditedValues((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full"
                  rows={4}
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Status</h3>
              {renderEditableField(
                "status",
                <Select
                  value={editedValues.status}
                  onValueChange={(value) =>
                    setEditedValues((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
