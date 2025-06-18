import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainHeader from '@/components/layout/MainHeader';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import PageFooter from '@/components/layout/PageFooter';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { User, Lock, Bell, Palette, Mail, Phone, MapPin, Home } from 'lucide-react';

// Schema for Profile Form
const profileFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z.string().optional(),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Schema for Password Change Form
const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters." }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match.",
  path: ["confirmPassword"],
});
type PasswordFormValues = z.infer<typeof passwordFormSchema>;


const UserSettingsPage = () => {
  console.log('UserSettingsPage loaded');

  // Profile Form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "Aditya Sharma", // Placeholder
      email: "aditya.sharma@example.com", // Placeholder
      phoneNumber: "555-123-4567",
      streetAddress: "123 Finance St",
      city: "Metropolis",
      postalCode: "12345",
      country: "USA",
    },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    console.log("Profile submitted:", data);
    toast.success("Profile updated successfully!");
  }

  // Password Form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onPasswordSubmit(data: PasswordFormValues) {
    console.log("Password change submitted:", data);
    toast.success("Password changed successfully!");
    passwordForm.reset();
  }

  // State for notification switches (placeholders)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [transactionAlerts, setTransactionAlerts] = useState(true);

  // State for display settings (placeholders)
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("medium");


  return (
    <div className="flex flex-col min-h-screen bg-muted/20 dark:bg-muted/40">
      <MainHeader />
      <div className="flex flex-1">
        <CollapsibleSidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">User Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your account preferences and settings.</p>
            </header>

            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="profile"><User className="w-4 h-4 mr-2 inline-block" />Profile</TabsTrigger>
                <TabsTrigger value="security"><Lock className="w-4 h-4 mr-2 inline-block" />Security</TabsTrigger>
                <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2 inline-block" />Notifications</TabsTrigger>
                <TabsTrigger value="display"><Palette className="w-4 h-4 mr-2 inline-block" />Display</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your contact details and address.</CardDescription>
                  </CardHeader>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                      <CardContent className="space-y-6">
                        <FormField
                          control={profileForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number (Optional)</FormLabel>
                                <FormControl>
                                  <Input type="tel" placeholder="Your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={profileForm.control}
                          name="streetAddress"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Street Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 Main St" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your city" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your postal code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                           <FormField
                            control={profileForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                          {profileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Accordion type="single" collapsible className="w-full space-y-6" defaultValue="password">
                  <AccordionItem value="password">
                     <Card>
                        <AccordionTrigger className="p-6 text-lg font-medium">Change Password</AccordionTrigger>
                        <AccordionContent className="p-6 pt-0">
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                            <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="Enter current password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="Enter new password" {...field} />
                                    </FormControl>
                                    <FormDescription>Must be at least 8 characters long.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                    <Input type="password" placeholder="Confirm new password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="mt-2">
                                {passwordForm.formState.isSubmitting ? "Updating..." : "Update Password"}
                            </Button>
                            </form>
                        </Form>
                        </AccordionContent>
                     </Card>
                  </AccordionItem>

                  <AccordionItem value="mfa">
                    <Card>
                        <AccordionTrigger className="p-6 text-lg font-medium">Multi-Factor Authentication (MFA)</AccordionTrigger>
                        <AccordionContent className="p-6 pt-0">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account.
                            </p>
                            <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                <Switch id="mfa-switch" checked={false} onCheckedChange={() => toast.info("MFA setting clicked. (Placeholder)")} />
                                <Label htmlFor="mfa-switch" className="flex-grow">Enable Multi-Factor Authentication</Label>
                            </div>
                            <Button variant="outline" onClick={() => toast.info("Setup MFA clicked. (Placeholder)")}>Setup MFA</Button>
                        </div>
                        </AccordionContent>
                    </Card>
                  </AccordionItem>

                  <AccordionItem value="login-history">
                    <Card>
                        <AccordionTrigger className="p-6 text-lg font-medium">Login History</AccordionTrigger>
                        <AccordionContent className="p-6 pt-0">
                            <p className="text-sm text-muted-foreground">Review recent login activity on your account.</p>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li className="p-2 border rounded-md">Login from Chrome on Windows - Today at 10:00 AM (IP: 192.168.1.100)</li>
                                <li className="p-2 border rounded-md">Login from Safari on macOS - Yesterday at 08:00 PM (IP: 10.0.0.5)</li>
                            </ul>
                            <Button variant="link" className="mt-2 p-0 h-auto" onClick={() => toast.info("View all login history clicked. (Placeholder)")}>View all login history</Button>
                        </AccordionContent>
                    </Card>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive important updates and alerts via email.</p>
                      </div>
                      <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="sms-notifications" className="font-medium">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Get critical alerts via text message (charges may apply).</p>
                      </div>
                      <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                    </div>
                     <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="transaction-alerts" className="font-medium">Transaction Alerts</Label>
                        <p className="text-sm text-muted-foreground">Notify me about transactions over a certain amount.</p>
                      </div>
                      <Switch id="transaction-alerts" checked={transactionAlerts} onCheckedChange={setTransactionAlerts} />
                    </div>
                  </CardContent>
                   <CardFooter className="border-t px-6 py-4">
                        <Button onClick={() => toast.success("Notification preferences saved!")}>Save Preferences</Button>
                    </CardFooter>
                </Card>
              </TabsContent>

              {/* Display & Accessibility Tab */}
              <TabsContent value="display">
                <Card>
                  <CardHeader>
                    <CardTitle>Display & Accessibility</CardTitle>
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                      </div>
                      <Switch id="dark-mode" checked={darkMode} onCheckedChange={(checked) => {
                          setDarkMode(checked);
                          toast.info(`Dark mode ${checked ? 'enabled' : 'disabled'}. (Placeholder)`);
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="font-size" className="font-medium">Font Size</Label>
                       <p className="text-sm text-muted-foreground mb-2">Adjust the text size for better readability.</p>
                      {/* Basic select or radio group for font size - Placeholder */}
                       <select
                        id="font-size"
                        value={fontSize}
                        onChange={(e) => {
                            setFontSize(e.target.value);
                            toast.info(`Font size set to ${e.target.value}. (Placeholder)`);
                        }}
                        className="w-full p-2 border rounded-md bg-background"
                        >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                        <Button onClick={() => toast.success("Display settings saved!")}>Save Display Settings</Button>
                    </CardFooter>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </main>
      </div>
      <PageFooter />
    </div>
  );
};

export default UserSettingsPage;