-- Create profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create conversations table
create table conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  model_id text not null,
  level text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  is_active boolean default true
);

-- Create messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default now(),
  order_index bigint not null
);

-- Create indexes for performance
create index idx_conversations_user_id on conversations(user_id);
create index idx_conversations_created_at on conversations(created_at);
create index idx_messages_conversation_id on messages(conversation_id);
create index idx_messages_conversation_order on messages(conversation_id, order_index);
create index idx_messages_created_at on messages(created_at);
create index idx_messages_role on messages(role);

-- Create updated_at function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Create triggers for updated_at
create trigger update_conversations_updated_at 
  before update on conversations 
  for each row execute function update_updated_at_column();

-- Enable Row Level Security
alter table profiles enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;

-- Create RLS policies
create policy "Users can view their own profiles" on profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profiles" on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profiles" on profiles
  for update using (auth.uid() = id);

create policy "Users can view their conversations" on conversations
  for select using (auth.uid() = user_id);

create policy "Users can insert their conversations" on conversations
  for insert with check (auth.uid() = user_id);

create policy "Users can update their conversations" on conversations
  for update using (auth.uid() = user_id);

create policy "Users can delete their conversations" on conversations
  for delete using (auth.uid() = user_id);

create policy "Users can view messages in their conversations" on messages
  for select using (
    conversation_id in (select id from conversations where user_id = auth.uid())
  );

create policy "Users can insert messages in their conversations" on messages
  for insert with check (
    conversation_id in (select id from conversations where user_id = auth.uid())
  );

create policy "Users can update messages in their conversations" on messages
  for update using (
    conversation_id in (select id from conversations where user_id = auth.uid())
  );

create policy "Users can delete messages in their conversations" on messages
  for delete using (
    conversation_id in (select id from conversations where user_id = auth.uid())
  );