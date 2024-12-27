import React from "react";
import {
  Input,
  Option,
  Select,
  Button,
  Dialog,
  Textarea,
  IconButton,
  Typography,
  DialogBody,
  DialogHeader,
  DialogFooter,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
 
export function AddProductDialog() {
  const [open, setOpen] = React.useState(false);
 
  const handleOpen = () => setOpen(!open);
  const METRIC_OPTIONS = [
    { label: "Grams (g)", value: "grams" },
    { label: "Kilograms (kg)", value: "kilograms" },
    { label: "Pounds (lbs)", value: "pounds" },
    { label: "Ounces (oz)", value: "ounces" },
    { label: "Milliliters (ml)", value: "milliliters" },
    { label: "Liters (l)", value: "liters" },
    { label: "Pieces (pcs)", value: "pieces" },
    { label: "Packs", value: "packs" },
    { label: "Dozen", value: "dozen" },
    { label: "Units", value: "units" },
  ];
  
  return (
    <>
      <Button onClick={handleOpen} variant="gradient">
        Add Item
      </Button>
      <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
        <DialogHeader className="relative m-0 block">
          <Typography variant="h4" color="blue-gray">
            Add New Item
          </Typography>
          <Typography className="mt-1 font-normal text-gray-600">
            Keep your pantry up-to-date and organized.
          </Typography>
          <IconButton
            size="sm"
            variant="text"
            className="!absolute right-3.5 top-3.5"
            onClick={handleOpen}
          >
            <XMarkIcon className="h-4 w-4 stroke-2" />
          </IconButton>
        </DialogHeader>
        <DialogBody className="space-y-4 pb-6">
          <div>
            {/* add the name */}
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Name
            </Typography>
            <Input
              color="gray"
              size="lg"
              placeholder="eg. Tomatoes"
              name="name"
              className="placeholder:opacity-100 focus:!border-t-gray-900"
              containerProps={{
                className: "!min-w-full",
              }}
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
          {/* enter the Quanity of the item */}
          <div className="flex gap-4">
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
                Quanity
              </Typography>
              <Input
                color="gray"
                size="lg"
                placeholder="eg. 10"
                name="weight"
                className="placeholder:opacity-100 focus:!border-t-gray-900"
                containerProps={{
                  className: "!min-w-full",
                }}
                labelProps={{
                  className: "hidden",
                }}
              />
            </div>
            {/* enter the metric  */}
            <div className="w-full">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 text-left font-medium"
              >
              Metric
            </Typography>
            <Select
                className="!w-full !border-[1.5px] !border-blue-gray-200/90 bg-white text-gray-800 ring-4 ring-transparent placeholder:text-gray-600 focus:!border-primary"
                placeholder="Select Metric"
                labelProps={{
                className: "hidden",
                }}
            >
                {METRIC_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                    {option.label}
                </Option>
                ))}
            </Select>
            </div>
          </div>
        {/* optional, keep or remove, let the user add notes */}
          <div>
            <Typography
              variant="small"
              color="blue-gray"
              className="mb-2 text-left font-medium"
            >
              Notes (Optional)
            </Typography>
            <Textarea
              rows={7}
              placeholder="eg. This is a white shoes with a comfortable sole."
              className="!w-full !border-[1.5px] !border-blue-gray-200/90 !border-t-blue-gray-200/90 bg-white text-gray-600 ring-4 ring-transparent focus:!border-primary focus:!border-t-blue-gray-900 group-hover:!border-primary"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button className="ml-auto items-center" onClick={handleOpen}>
            Add Item
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}