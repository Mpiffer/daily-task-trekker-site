import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
};

/*
### Checklist

| name       | type                     | format | required |
|------------|--------------------------|--------|----------|
| id         | int8                     | number | true     |
| created_at | timestamp with time zone | string | true     |
| date       | date                     | string | true     |
| tasks      | jsonb                    | object | false    |
| productName| text                     | string | false    |
| readyTime  | time                     | string | false    |

Note: 
- 'id' is a Primary Key.
- 'created_at' has a default value of now().
- 'date' is added to store the specific date for each checklist.
- 'tasks' is added to store the tasks and their states.
- 'productName' is added to store the product name.
- 'readyTime' is added to store the time when the checklist was marked as ready.

No foreign key relationships are present for this table.
*/

export const useChecklist = (date) => useQuery({
    queryKey: ['checklists', date],
    queryFn: () => fromSupabase(supabase.from('Checklist').select('*').eq('date', date).single()),
});

export const useChecklists = () => useQuery({
    queryKey: ['checklists'],
    queryFn: () => fromSupabase(supabase.from('Checklist').select('*')),
});

export const useAddChecklist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newChecklist) => fromSupabase(supabase.from('Checklist').insert([newChecklist])),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checklists'] });
        },
    });
};

export const useUpdateChecklist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ...updateData }) => fromSupabase(supabase.from('Checklist').update(updateData).eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checklists'] });
        },
    });
};

export const useDeleteChecklist = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => fromSupabase(supabase.from('Checklist').delete().eq('id', id)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checklists'] });
        },
    });
};