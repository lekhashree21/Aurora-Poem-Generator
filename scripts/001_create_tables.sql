-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create poems table
CREATE TABLE IF NOT EXISTS public.poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  theme TEXT NOT NULL,
  custom_prompt TEXT,
  tags TEXT[] DEFAULT '{}',
  creativity_level INT DEFAULT 7,
  poem_length INT DEFAULT 16,
  poetic_devices TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create collections table
CREATE TABLE IF NOT EXISTS public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create collection_poems junction table
CREATE TABLE IF NOT EXISTS public.collection_poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(collection_id, poem_id)
);

-- Create shared_poems table for sharing links
CREATE TABLE IF NOT EXISTS public.shared_poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poem_id UUID NOT NULL REFERENCES public.poems(id) ON DELETE CASCADE,
  shared_by_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shared_poems ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for poems
CREATE POLICY "poems_select_own" ON public.poems FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "poems_insert_own" ON public.poems FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "poems_update_own" ON public.poems FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "poems_delete_own" ON public.poems FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for collections
CREATE POLICY "collections_select_own" ON public.collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "collections_insert_own" ON public.collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "collections_update_own" ON public.collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "collections_delete_own" ON public.collections FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for collection_poems
CREATE POLICY "collection_poems_select_own" ON public.collection_poems FOR SELECT 
  USING (collection_id IN (SELECT id FROM public.collections WHERE user_id = auth.uid()));
CREATE POLICY "collection_poems_insert_own" ON public.collection_poems FOR INSERT 
  WITH CHECK (collection_id IN (SELECT id FROM public.collections WHERE user_id = auth.uid()));
CREATE POLICY "collection_poems_delete_own" ON public.collection_poems FOR DELETE 
  USING (collection_id IN (SELECT id FROM public.collections WHERE user_id = auth.uid()));

-- RLS Policies for shared_poems
CREATE POLICY "shared_poems_select_own" ON public.shared_poems FOR SELECT USING (auth.uid() = shared_by_id);
CREATE POLICY "shared_poems_insert_own" ON public.shared_poems FOR INSERT WITH CHECK (auth.uid() = shared_by_id);
CREATE POLICY "shared_poems_delete_own" ON public.shared_poems FOR DELETE USING (auth.uid() = shared_by_id);

-- Create trigger for auto-creating profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'display_name', new.email));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
