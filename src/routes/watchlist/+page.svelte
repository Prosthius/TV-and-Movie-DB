<script lang="ts">
  import Drawer, {
    AppContent,
    Content,
    Header,
    Title,
    Subtitle,
  } from '@smui/drawer';
  import Button, { Label } from '@smui/button';
  import List, { Item, Text } from '@smui/list';

  let open: boolean = true;
  let active: string = 'Gray Kittens';

  function setActive(value: string) {
    active = value;
  }
</script>

<AppContent class="app-content">
  <main class="main-content">
    <Button on:click={() => (open = !open)}
      ><Label>Toggle Filter</Label></Button
    >
  </main>
</AppContent>

<div class="drawer-container">
  <Drawer variant="dismissible" bind:open>
    <Header>
      <Title>Filter</Title>
    </Header>
    <Content>
      <List>
        <Item
          href="javascript:void(0)"
          on:click={() => setActive('Gray Kittens')}
          activated={active === 'Gray Kittens'}
        >
          <Text>Gray Kittens</Text>
        </Item>
        <Item
          href="javascript:void(0)"
          on:click={() => setActive('A Space Rocket')}
          activated={active === 'A Space Rocket'}
        >
          <Text>A Space Rocket</Text>
        </Item>
        <Item
          href="javascript:void(0)"
          on:click={() => setActive('100 Pounds of Gravel')}
          activated={active === '100 Pounds of Gravel'}
        >
          <Text>100 Pounds of Gravel</Text>
        </Item>
        <Item
          href="javascript:void(0)"
          on:click={() => setActive('All of the Shrimp')}
          activated={active === 'All of the Shrimp'}
        >
          <Text>All of the Shrimp</Text>
        </Item>
        <Item
          href="javascript:void(0)"
          on:click={() => setActive('A Planet with a Mall')}
          activated={active === 'A Planet with a Mall'}
        >
          <Text>A Planet with a Mall</Text>
        </Item>
      </List>
    </Content>
  </Drawer>
</div>

<style>
  .drawer-container {
    position: relative;
    display: flex;
    height: 350px;
    max-width: 600px;
    border: 1px solid
      var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
    overflow: hidden;
    z-index: 0;
  }

  .main-content {
    overflow: auto;
    padding: 16px;
    height: 100%;
    box-sizing: border-box;
  }
</style>