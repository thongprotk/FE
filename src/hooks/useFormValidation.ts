import { useState, useCallback } from 'react'

export interface ValidationError {
    field: string
    message: string
}

export interface ValidationRule {
    required?: { message: string }
    minLength?: { value: number; message: string }
    maxLength?: { value: number; message: string }
    pattern?: { value: RegExp; message: string }
    custom?: (value: any) => string | undefined
}

export interface ValidationRules {
    [field: string]: ValidationRule
}

/**
 * Custom hook for form validation
 * Provides validation logic and error management
 */
export function useFormValidation(rules: ValidationRules) {
    const [errors, setErrors] = useState<ValidationError[]>([])
    const [touched, setTouched] = useState<Set<string>>(new Set())

    const validateField = useCallback(
        (field: string, value: any): string | undefined => {
            const rule = rules[field]
            if (!rule) return undefined

            // Required validation
            if (rule.required && !value) {
                return rule.required.message
            }

            // Min length validation
            if (rule.minLength && value && value.length < rule.minLength.value) {
                return rule.minLength.message
            }

            // Max length validation
            if (rule.maxLength && value && value.length > rule.maxLength.value) {
                return rule.maxLength.message
            }

            // Pattern validation
            if (rule.pattern && value && !rule.pattern.value.test(value)) {
                return rule.pattern.message
            }

            // Custom validation
            if (rule.custom) {
                return rule.custom(value)
            }

            return undefined
        },
        [rules]
    )

    const validateForm = useCallback(
        (formData: Record<string, any>): boolean => {
            const newErrors: ValidationError[] = []

            Object.keys(rules).forEach((field) => {
                const error = validateField(field, formData[field])
                if (error) {
                    newErrors.push({ field, message: error })
                }
            })

            setErrors(newErrors)
            return newErrors.length === 0
        },
        [rules, validateField]
    )

    const handleBlur = useCallback((field: string) => {
        setTouched((prev) => new Set(prev).add(field))
    }, [])

    const handleChange = useCallback(
        (field: string, value: any) => {
            // Validate field on change if it's been touched
            if (touched.has(field)) {
                const error = validateField(field, value);
                if (!error) {
                    setErrors((prev) => prev.filter((e) => e.field !== field));
                }
            }
        },
        [touched, validateField]
    )

    const clearErrors = useCallback(() => {
        setErrors([])
    }, [])

    const getFieldError = useCallback(
        (field: string): string | undefined => {
            return errors.find((e) => e.field === field)?.message
        },
        [errors]
    )

    const isFieldTouched = useCallback(
        (field: string) => {
            return touched.has(field)
        },
        [touched]
    )

    const resetValidation = useCallback(() => {
        setErrors([])
        setTouched(new Set())
    }, [])

    return {
        errors,
        touched,
        validateField,
        validateForm,
        handleBlur,
        handleChange,
        clearErrors,
        getFieldError,
        isFieldTouched,
        resetValidation,
    }
}
