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

Note: 
- 'id' is a Primary Key.
- 'created_at' has a default value of now().

No foreign key relationships are present for this table.
*/

export const useChecklist = (id) => useQuery({
    queryKey: ['checklists', id],
    queryFn: () => fromSupabase(supabase.from('Checklist').select('*').eq('id', id).single()),
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