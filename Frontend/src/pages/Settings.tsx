import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { apiService } from "../config/api";
import { Lock, User as UserIcon } from "lucide-react";

interface ProfileFormData {
  name: string;
  phone: string;
  storeName: string;
  address: {
    street: string;
    city: string;
    state: string;
  };
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: user?.name || "",
    phone: user?.phone || "",
    storeName: user?.storeName || "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
    },
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await apiService.updateProfile({
        name: profileForm.name,
        phone: profileForm.phone,
        storeName: profileForm.storeName,
        address: {
          street: profileForm.address.street,
          city: profileForm.address.city,
          state: profileForm.address.state,
          zipCode: user?.address?.zipCode || "",
        },
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setLoading(false);
      return;
    }

    try {
      await apiService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage({ type: "success", text: "Password changed successfully!" });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to change password";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                : "bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
            }`}>
            {message.text}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}>
                <UserIcon className="inline-block w-4 h-4 mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "password"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                }`}>
                <Lock className="inline-block w-4 h-4 mr-2" />
                Password
              </button>
            </nav>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Profile Information
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Update your personal information and store details
              </p>
            </div>
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={profileForm.phone}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="storeName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Store Name
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    value={profileForm.storeName}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        storeName: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="street"
                      value={profileForm.address.street}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          address: {
                            ...profileForm.address,
                            street: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      value={profileForm.address.city}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          address: {
                            ...profileForm.address,
                            city: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={profileForm.address.state}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          address: {
                            ...profileForm.address,
                            state: e.target.value,
                          },
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === "password" && (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Change Password
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Update your password to keep your account secure
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
