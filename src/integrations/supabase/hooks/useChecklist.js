import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
    const { data, error } = await query;
    if (error) throw error;
    return data;
};

export const useChecklist = (date) => useQuery({
    queryKey: ['checklists', date],
    queryFn: () => fromSupabase(
        supabase
            .from('Checklist')
            .select('*')
            .eq('created_at', date)
    ),
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