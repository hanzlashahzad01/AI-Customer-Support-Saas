import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        companyName: '',
        role: 'company_admin' // Default to company admin for new signups
    });
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
    const register = useAuthStore(state => state.register);
    const isLoading = useAuthStore(state => state.isLoading);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Please enter a valid email';
        }

        if (!formData.companyName.trim()) {
            errors.companyName = 'Company name is required';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }


        try {
            console.log('🚀 Attempting registration with:', {
                name: formData.name,
                email: formData.email,
                companyName: formData.companyName,
                role: formData.role
            });

            await register(formData);

            // Small delay to ensure state updates
            await new Promise(resolve => setTimeout(resolve, 100));

            console.log('✅ Registration successful, navigating to dashboard');
            console.log('Auth state:', useAuthStore.getState());

            // Force navigation (using hard reload to ensure clean state)
            window.location.href = '/dashboard';
        } catch (err: any) {
            console.error('❌ Registration error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
            setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-md p-8 rounded-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Get Started
                    </h1>
                    <p className="text-muted-foreground mt-2">Create your free account</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 text-center border border-destructive/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            label="Full Name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {validationErrors.name && (
                            <p className="text-xs text-destructive mt-1">{validationErrors.name}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="you@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {validationErrors.email && (
                            <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Company Name"
                            name="companyName"
                            placeholder="Acme Inc."
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                        />
                        {validationErrors.companyName && (
                            <p className="text-xs text-destructive mt-1">{validationErrors.companyName}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Create a strong password (min 6 characters)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {validationErrors.password && (
                            <p className="text-xs text-destructive mt-1">{validationErrors.password}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                        Create Account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
