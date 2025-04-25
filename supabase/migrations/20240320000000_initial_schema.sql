-- Create tables
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'TODO',
    priority TEXT NOT NULL DEFAULT 'MEDIUM',
    assignee_id UUID REFERENCES public.users(id),
    creator_id UUID REFERENCES public.users(id) NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) NOT NULL,
    task_id UUID REFERENCES public.tasks(id) NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create functions for email notifications
CREATE OR REPLACE FUNCTION public.handle_new_task()
RETURNS TRIGGER AS $$
BEGIN
    -- Send email notification to assignee if exists
    IF NEW.assignee_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, task_id, type, message)
        VALUES (
            NEW.assignee_id,
            NEW.id,
            'TASK_ASSIGNED',
            'You have been assigned to task: ' || NEW.title
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_task_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Send email notification to assignee and creator
    IF NEW.status != OLD.status THEN
        -- Notify assignee
        IF NEW.assignee_id IS NOT NULL THEN
            INSERT INTO public.notifications (user_id, task_id, type, message)
            VALUES (
                NEW.assignee_id,
                NEW.id,
                'STATUS_CHANGED',
                'Task status changed to ' || NEW.status || ' for task: ' || NEW.title
            );
        END IF;
        
        -- Notify creator
        INSERT INTO public.notifications (user_id, task_id, type, message)
        VALUES (
            NEW.creator_id,
            NEW.id,
            'STATUS_CHANGED',
            'Task status changed to ' || NEW.status || ' for task: ' || NEW.title
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER on_task_created
    AFTER INSERT ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_task();

CREATE TRIGGER on_task_status_changed
    AFTER UPDATE ON public.tasks
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION public.handle_task_status_change();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view tasks they are assigned to or created"
    ON public.tasks FOR SELECT
    USING (
        auth.uid() = creator_id OR
        auth.uid() = assignee_id
    );

CREATE POLICY "Users can create tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update tasks they are assigned to or created"
    ON public.tasks FOR UPDATE
    USING (
        auth.uid() = creator_id OR
        auth.uid() = assignee_id
    );

CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id); 