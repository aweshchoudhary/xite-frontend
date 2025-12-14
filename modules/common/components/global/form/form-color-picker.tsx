import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { UseFormReturn } from "react-hook-form";
import { Button } from "../../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { HexColorPicker } from "react-colorful";
import { readableColor } from "polished";
import { Input } from "../../ui/input";

// Common Form Color Picker Field
const FormColorPicker = ({
  form,
  textColorName,
  backgroundColorName,
  label,
  isBackground = true,
}: {
  form: UseFormReturn<any>;
  textColorName: any;
  backgroundColorName: any;
  label: string;
  isBackground?: boolean;
}) => {
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            style={{
              backgroundColor: form.watch(backgroundColorName),
              color: form.watch(textColorName),
            }}
          >
            <span>{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full bg-background border shadow-2xl z-[999] p-6">
          <div className="grid lg:grid-cols-2 gap-10">
            {isBackground && (
              <div>
                <FormLabel className="mb-5">Background Color</FormLabel>
                <FormField
                  control={form.control}
                  name={backgroundColorName}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <HexColorPicker
                            color={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                              form.setValue(
                                textColorName,
                                readableColor(value)
                              );
                            }}
                            className="w-full"
                          />
                          <Input
                            placeholder="Hex Code"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              form.setValue(
                                textColorName,
                                readableColor(e.target.value)
                              );
                            }}
                            className="mt-2 w-full"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div>
              <FormLabel className="mb-5">Text Color</FormLabel>
              <FormField
                control={form.control}
                name={textColorName}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div>
                        <HexColorPicker
                          color={field.value}
                          onChange={field.onChange}
                          className="w-full"
                        />
                        <Input
                          placeholder="Hex Code"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                          className="mt-2 w-full"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FormColorPicker;
