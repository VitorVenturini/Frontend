import { Button } from "@/components/ui/button";
import DeleteActions from "@/components/actions/DeleteAction";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Pencil } from "lucide-react";
import CardCreateAction from "@/components/actions/CardCreateAction";
import { ActionsInteface } from "@/components/actions/ActionsContext";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { MessageCircleWarning } from "lucide-react";
import NotifyActions from "@/components/actions/CardNotificationAction";
import { useLanguage } from "@/components/language/LanguageContext";
import texts from "@/_data/texts.json"; // Importando os textos de tradução

export const columnsActions: ColumnDef<ActionsInteface>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "action_name",
    header: ({ column }) => {
      const { language } = useLanguage();
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {texts[language].actionName}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "action_start_type",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].trigger;
    },
  },
  {
    accessorKey: "action_start_prt",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].inputParameter;
    },
  },
  {
    accessorKey: "action_start_device_parameter",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].deviceParameter;
    },
  },
  {
    accessorKey: "action_start_device",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].entryIotDevice;
    },
  },
  {
    accessorKey: "action_exec_user",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].user;
    },
  },
  {
    accessorKey: "action_exec_device",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].outputIotDevice;
    },
  },
  {
    accessorKey: "action_exec_type",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].outputActionExecType;
    },
  },
  {
    accessorKey: "action_exec_prt",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].outputDeviceParameter;
    },
  },
  {
    accessorKey: "action_exec_type_command_mode",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].command;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].updatedAt;
    },
  },
  {
    accessorKey: "create_user",
    header: ({ column }) => {
      const { language } = useLanguage(); // Obtém o idioma selecionado
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {texts[language].lastEditedBy}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: ({ column }) => {
      const { language } = useLanguage();
      return texts[language].actions;
    },
    cell: ({ row }) => {
      const actions = row.original;
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      return (
        <div className="flex justify-center gap-2 items-center">
          <Dialog >
            <DialogTrigger>
              <MessageCircleWarning />
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <NotifyActions
                id={actions.id}
                isUpdate={true}
                notifications={actions.notifications}
              />
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Button variant="ghost" size="icon">
                <Pencil />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl">
              <CardCreateAction
                action={actions}
                isUpdate={true}
                onSuccess={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <DeleteActions id={actions.id} />
        </div>
      );
    },
  },
];
