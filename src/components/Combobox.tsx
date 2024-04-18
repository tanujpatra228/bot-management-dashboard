import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"

type ComboboxPropsType = {
  title: string,
  options: Record<string, any>[],
  isMultiSelect: boolean,
} & (
    {
      isMultiSelect: true,
      handleValueChange: (value: string[]) => void,
      selectedValue: string[],
    } | {
      isMultiSelect: false,
      handleValueChange: (value: string) => void,
      selectedValue: string,
    }
  )

const Combobox = (props: ComboboxPropsType) => {
  const { title, options } = props;
  const [open, setOpen] = useState(false);

  const renderSelectedValues = useMemo(() => {
    if (!props.isMultiSelect) {
      return props.selectedValue;
    }
    const values = [...props.selectedValue];
    return values.length > 3 ? values.slice(0, 2).join(', ') + `, +${values.length - 2}` : values.join(', ');
  }, [props.selectedValue]);

  const handleChnage = (value: string) => {
    if (props.isMultiSelect) {
      let newValues = [...props.selectedValue];
      if (newValues.includes(value)) {
        newValues = newValues.filter(val => val !== value)
      } else {
        newValues.push(value);
      }
      props.handleValueChange(newValues)
    }
    else {
      props.handleValueChange(value);
    }
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <p className="capitalize">{title}</p>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between capitalize"
          >
            {
              renderSelectedValues || `Select ${title}`
            }
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {
                  options.map((option, i) => (
                    <CommandItem
                      key={i}
                      value={option.value}
                      className="capitalize"
                      onSelect={(val) => {
                        handleChnage(val);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          (props.isMultiSelect ? (props.selectedValue.includes(option.value) ? "opacity-100" : "opacity-0") : props.selectedValue === option.values ? "opacity-100" : "opacity-0")
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))
                }
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default Combobox;