<script lang="ts">
  import { renderHarvestables } from "$lib/harvest";
  import { ajax } from "$lib/utils";
  import { onMount } from "svelte";

  onMount(async () => {
    const { harvestables: harvestables } = await ajax("/api/harvest");
    renderHarvestables(Object.values(harvestables));
  });
</script>

<section class="section tab-harvest">
  <div class="container is-fluid">
    <div class="columns">
      <div class="column is-12 has-text-centered">
        <div>
          <p class="heading">Harvestables</p>
        </div>
      </div>
    </div>
    <div class="columns is-flex-wrap-wrap" id="d3-harvestables" />
  </div>
</section>
