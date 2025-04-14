
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, CATEGORIES, Budget, BudgetFormData } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Form schema
const formSchema = z.object({
  category: z.enum(CATEGORIES as [Category, ...Category[]], {
    required_error: 'Please select a category',
  }),
  amount: z
    .number()
    .positive({ message: 'Budget amount must be a positive number' }),
});

interface BudgetFormProps {
  budget?: Budget;
  existingCategories: Category[];
  onSubmit: (data: BudgetFormData) => void;
  onCancel: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  budget,
  existingCategories,
  onSubmit,
  onCancel,
}) => {
  // Get categories that don't already have budgets
  const availableCategories = CATEGORIES.filter(
    category => !existingCategories.includes(category) || budget?.category === category
  );

  // Initialize form with default values or existing budget
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: budget
      ? {
          category: budget.category,
          amount: budget.amount,
        }
      : {
          category: availableCategories[0],
          amount: 0,
        },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Ensure all required fields are present before submitting
    const formData: BudgetFormData = {
      category: data.category,
      amount: data.amount
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!!budget} // Disable if editing existing budget
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {budget 
                    ? "Category cannot be changed for existing budgets" 
                    : "Select the category you want to budget for"}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Budget Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Set your monthly budget limit for this category
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {budget ? 'Update' : 'Add'} Budget
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BudgetForm;
