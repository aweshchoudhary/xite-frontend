"use client";
import { Field, FieldError, FieldGroup, FieldLabel } from "@ui/field";
import { Input } from "@ui/input";
import { Controller, UseFormReturn } from "react-hook-form";
import { MicrositeFormInput } from "@microsite-cms/common/services/db/actions/microsite/schema";
import { Palette, Image as ImageIcon, Type, Upload, Globe } from "lucide-react";
import Image from "next/image";
import { Button } from "@ui/button";
import { useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

interface FormBrandingProps {
  form: UseFormReturn<MicrositeFormInput>;
}

export default function FormBranding({ form }: FormBrandingProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const [logoPreview, setLogoPreview] = useState<string | undefined>(() => {
    const initialValue = form.getValues("branding.logo");
    if (typeof initialValue === "string" && initialValue) {
      return initialValue.replace("http://localhost:3000", "");
    }
    return undefined;
  });

  const [faviconPreview, setFaviconPreview] = useState<string | undefined>(
    () => {
      const initialValue = form.getValues("branding.favicon");
      if (typeof initialValue === "string" && initialValue) {
        return initialValue.replace("http://localhost:3000", "");
      }
      return undefined;
    }
  );

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Branding</h2>
      </header>

      <div className="w-full relative p-8 space-y-6 bg-background shadow-xs rounded-xl border border-border/50">
        {/* Domain */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Domain</h3>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <FieldGroup>
              <Controller
                name="domain"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="domain">Domain</FieldLabel>
                    <Input
                      id="domain"
                      {...field}
                      placeholder="e.g., example.com"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </div>
        {/* Logo and Favicon */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Assets</h3>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <FieldGroup>
              <Controller
                name="branding.logo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="branding-logo">Logo</FieldLabel>
                    {logoPreview ? (
                      <div className="max-w-xs p-3 aspect-square h-auto object-cover bg-muted rounded-lg border mb-3">
                        <Image
                          src={logoPreview}
                          alt="Logo"
                          width={200}
                          height={200}
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="size-4 mr-2" />
                      {logoPreview ? "Change Logo" : "Upload Logo"}
                    </Button>
                    <Input
                      id="branding-logo"
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setLogoPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="branding.favicon"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="branding-favicon">Favicon</FieldLabel>
                    {faviconPreview ? (
                      <div className="max-w-xs p-3 aspect-square h-auto object-cover bg-muted rounded-lg border mb-3">
                        <Image
                          src={faviconPreview}
                          alt="Favicon"
                          width={32}
                          height={32}
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : null}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => faviconInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="size-4 mr-2" />
                      {faviconPreview ? "Change Favicon" : "Upload Favicon"}
                    </Button>
                    <Input
                      id="branding-favicon"
                      type="file"
                      ref={faviconInputRef}
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                          setFaviconPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Colors</h3>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <FieldGroup>
              <Controller
                name="branding.colors.primary"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="color-primary">
                      Primary Color
                    </FieldLabel>
                    <div className="flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 p-0"
                            style={{
                              backgroundColor: field.value || "#000000",
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <HexColorPicker
                            color={field.value || "#000000"}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="color-primary"
                        {...field}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="branding.colors.primary_foreground"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="color-primary-foreground">
                      Primary Foreground
                    </FieldLabel>
                    <div className="flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 p-0"
                            style={{
                              backgroundColor: field.value || "#ffffff",
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <HexColorPicker
                            color={field.value || "#ffffff"}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="color-primary-foreground"
                        {...field}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="branding.colors.secondary"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="color-secondary">
                      Secondary Color
                    </FieldLabel>
                    <div className="flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 p-0"
                            style={{
                              backgroundColor: field.value || "#000000",
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <HexColorPicker
                            color={field.value || "#000000"}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="color-secondary"
                        {...field}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="branding.colors.secondary_foreground"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="color-secondary-foreground">
                      Secondary Foreground
                    </FieldLabel>
                    <div className="flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 p-0"
                            style={{
                              backgroundColor: field.value || "#ffffff",
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <HexColorPicker
                            color={field.value || "#ffffff"}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="color-secondary-foreground"
                        {...field}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="branding.colors.accent"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="color-accent">Accent Color</FieldLabel>
                    <div className="flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 p-0"
                            style={{
                              backgroundColor: field.value || "#000000",
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <HexColorPicker
                            color={field.value || "#000000"}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="color-accent"
                        {...field}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="branding.colors.accent_foreground"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="color-accent-foreground">
                      Accent Foreground
                    </FieldLabel>
                    <div className="flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 p-0"
                            style={{
                              backgroundColor: field.value || "#ffffff",
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <HexColorPicker
                            color={field.value || "#ffffff"}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="color-accent-foreground"
                        {...field}
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="branding.colors.border"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="color-border">Border Color</FieldLabel>
                    <div className="flex items-center gap-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-12 h-12 p-0"
                            style={{
                              backgroundColor: field.value || "#000000",
                            }}
                          />
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <HexColorPicker
                            color={field.value || "#000000"}
                            onChange={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="color-border"
                        {...field}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </div>

        {/* Fonts */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-4">
            <Type className="size-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Typography</h3>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <FieldGroup>
              <Controller
                name="branding.fonts.family"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="font-family">Font Family</FieldLabel>
                    <Input
                      id="font-family"
                      {...field}
                      placeholder="e.g., Arial, sans-serif"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
