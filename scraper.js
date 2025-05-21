(async () => {
  // leave empty to get all fields
  let fields = ['cmtid', 'ctime', 'author_username', 'comment', 'rating_star'];
  // let fields = [];

  // example: shopee.co.id/Senoparty-Parfum-by-Onix-Fragrance-Eau-de-Perfume-50ml-i.190702037.3515818016
  const shopid = 190702037;
  const itemid = 3515818016;

  // limit per page. max is 59 i think? doesn't really matter on what you set it to since it attempts to get all pages anyway
  const limit  = 59;

  const results = [];
  const seenIds = new Set();
  let headerFields = null;

  async function fetchPage(offset) {
    const params = new URLSearchParams({
      exclude_filter: 1,
      fe_toggle:      JSON.stringify([2,3]),
      filter:         1,
      filter_size:    0,
      flag:           1,
      fold_filter:    0,
      itemid:         itemid,
      shopid:         shopid,
      limit:          limit,
      offset:         offset,
      preferred_item_include_type: 1,
      preferred_item_item_id:      itemid,
      preferred_item_shop_id:      shopid,
      relevant_reviews: false,
      request_source:   2,
      tag_filter:       '',
      type:             0,
      variation_filters:''
    });

    const resp = await fetch(
      'https://shopee.co.id/api/v2/item/get_ratings?' + params.toString(),
      {
        credentials: 'same-origin',
        headers: {
          'Accept':           'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const json = await resp.json();
    return (json.data && json.data.ratings) ? json.data.ratings : [];
  }

  outer:
  for (let offset = 0; ; offset += limit) {
    console.log('Fetching offset ' + offset + '…');
    const ratings = await fetchPage(offset);
    if (!ratings.length) {
      console.log('No more reviews; exiting.');
      break;
    }

    for (const r of ratings) {
      if (r.comment != null) r.comment = r.comment.replace(/\n/g, '. ');

      seenIds.add(r.cmtid);

      if (!headerFields) {
        headerFields = (fields.length > 0 ? fields : Object.keys(r));
        fields = headerFields;
      }

      const entry = {};
      for (const key of fields) entry[key] = r[key];
      results.push(entry);
    }
  }

  // out csv
  const header = fields.join(',');
  const rows = results.map(item =>
    fields.map(f => {
      const val = item[f] != null ? String(item[f]) : '';
      return '"' + val.replace(/"/g, '""') + '"';
    }).join(',')
  );
  const csvContent = [header, ...rows].join('\n');
  
  // trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'shopee_ratings.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  console.log('CSV file generated and download should start.');
})();
